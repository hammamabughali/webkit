/// <reference path="../async/if.ts"/>
/// <reference path="../async/join.ts"/>
/// <reference path="../async/loop.ts"/>
/// <reference path="../lib/node.ts"/>
/// <reference path="../lib/zlib.ts"/>
/// <reference path="../types.ts"/>
/// <reference path="../util/crc.ts"/>
/// <reference path="../util/file.ts"/>



module kr3m.util
{
	class ZipFileEntry
	{
		public path:string;
		public name:string;
		public lastModified:Date;

		public compressionMethod:number;
		public generalPurposeFlags:number;

		public uncompressed:Buffer;
		public compressed:Buffer;
		public crc:number;

		public localHeaderOffset:number;
	}



	/*
		Klasse zum Erzeugen und Bearbeiten von Zip-Dateien
	*/
	export class Zip
	{
		public static MIMETYPE = "application/zip";

		private entries:ZipFileEntry[] = [];
		private crc = new Crc();
		private join = new kr3m.async.Join();
		private inErrorState = false;



		public addFile(path:string, newName:string = path):this
		{
			this.join.fork();
			fsLib.stat(path, (err:Error, stats:any) =>
			{
				if (stats && !stats.isDirectory())
				{
					var entry = new ZipFileEntry();
					entry.name = newName || path;
					entry.path = path;
					entry.lastModified = stats.mtime;
					this.entries.push(entry);
				}
				else
				{
					this.inErrorState = true;
					logError("Zip could not add file " + path);
				}
				this.join.done();
			});
			return this;
		}



		public addData(newName:string, data:string|Buffer):this
		{
			var entry = new ZipFileEntry();
			entry.name = newName;
			entry.lastModified = new Date();
			entry.uncompressed = typeof(data) == "string" ? Buffer.from(<string> data, "utf-8") : <Buffer> data;
			this.entries.push(entry);
			return this;
		}



		public addFolder(path:string, recursive:boolean = true):this
		{
			this.join.fork();
			fsLib.stat(path, (err:Error, stats:any) =>
			{
				if (!stats || !stats.isDirectory())
				{
					this.inErrorState = true;
					logError("Zip could not find " + path);
					return this.join.done();
				}

				File.crawlAsync(path, (relativePath, next) =>
				{
					this.addFile(path + "/" + relativePath);
					next();
				}, {wantFiles : true, wantFolders : false, recursive : true}, () =>
				{
					this.join.done();
				});
			});
			return this;
		}



		private getMsDosTime(date:Date):number
		{
			var result = date.getHours() << 11;
			result += date.getMinutes() << 5;
			result += Math.floor(date.getSeconds() / 2);
			return result;
		}



		private getMsDosDate(date:Date):number
		{
			var result = (date.getFullYear() - 1980) << 9;
			result += (date.getMonth() + 1) << 5;
			result += date.getDate();
			return result;
		}



		private getDate(msDosDate:number, msDosTime:number):Date
		{
			var date = new Date();

			var day = msDosDate && 31;
			var month = (msDosDate >> 5) && 15;
			var year = (msDosDate >> 9) + 1980;
			date.setFullYear(year, month - 1, day);

			var seconds = (msDosTime && 31) * 2;
			var minutes = (msDosTime >> 5) && 63;
			var hours = msDosTime >> 11;
			date.setHours(hours, minutes, seconds, 0);

			return date;
		}



		private readFile(
			buffer:Buffer, offset:number):{entry:ZipFileEntry, newOffset:number, skip:boolean}
		{
			var headerSignature = buffer.readUInt32LE(offset);
			if (headerSignature != 0x04034b50)
				return undefined;

			var entry = new ZipFileEntry();
			entry.generalPurposeFlags = buffer.readUInt16LE(offset + 6);
			entry.compressionMethod = buffer.readUInt16LE(offset + 8);
			var msDosTime = buffer.readUInt16LE(offset + 10);
			var msDosDate = buffer.readUInt16LE(offset + 12);
			entry.lastModified = this.getDate(msDosDate, msDosTime);
			entry.crc = buffer.readUInt32LE(offset + 14);
			var compressedLength = buffer.readUInt32LE(offset + 18);
			var nameLength = buffer.readUInt16LE(offset + 26);
			var extraFieldLength = buffer.readUInt16LE(offset + 28);
			var compressedOffset = offset + 30 + nameLength + extraFieldLength;
			entry.name = buffer.toString("ascii", offset + 30, offset + 30 + nameLength);
			if (compressedLength == 0)
				return {entry : undefined, newOffset : compressedOffset, skip : true};

			entry.compressed = buffer.slice(compressedOffset, compressedOffset + compressedLength);
			return {entry : entry, newOffset : compressedOffset + compressedLength, skip : false};
		}



		private getLocalHeader(
			entry:ZipFileEntry):Buffer
		{
			var buffer = Buffer.allocUnsafe(30 + entry.name.length);
			buffer.writeUInt32LE(0x04034b50, 0); // Header signature
			buffer.writeUInt16LE(0x0200, 4); // Version needed to extract (minimum)
			buffer.writeUInt16LE(entry.generalPurposeFlags, 6); // General purpose bit flag
			buffer.writeUInt16LE(entry.compressionMethod, 8); // Compression Method
			buffer.writeUInt16LE(this.getMsDosTime(entry.lastModified), 10); // File last modification time
			buffer.writeUInt16LE(this.getMsDosDate(entry.lastModified), 12); // File last modification date
			buffer.writeUInt32LE(entry.crc, 14); // CRC-32
			buffer.writeUInt32LE(entry.compressed.length, 18); // Compressed Size
			buffer.writeUInt32LE(entry.uncompressed.length, 22); // Uncompressed Size
			buffer.writeUInt16LE(entry.name.length, 26); // File name length
			buffer.writeUInt16LE(0, 28); // Extra field length
			buffer.write(entry.name, 30, entry.name.length, "ascii"); // File Name
			buffer.write("", 30 + entry.name.length, 0, "ascii"); // Extra field
			return buffer;
		}



		private getCentralDirectoryHeader(
			entry:ZipFileEntry):Buffer
		{
			var buffer = Buffer.allocUnsafe(46 + entry.name.length);
			buffer.writeUInt32LE(0x02014b50, 0); // Header signature
			buffer.writeUInt16LE(0x0200, 4); // Version made by
			buffer.writeUInt16LE(0x0200, 6); // Version needed to extract (minimum)
			buffer.writeUInt16LE(entry.generalPurposeFlags, 8); // General purpose bit flag
			buffer.writeUInt16LE(entry.compressionMethod, 10); // Compression method
			buffer.writeUInt16LE(this.getMsDosTime(entry.lastModified), 12); // File last modification time
			buffer.writeUInt16LE(this.getMsDosDate(entry.lastModified), 14); // File last modification date
			buffer.writeUInt32LE(entry.crc, 16); // CRC-32
			buffer.writeUInt32LE(entry.compressed.length, 20); // Compressed size
			buffer.writeUInt32LE(entry.uncompressed.length, 24); // Uncompressed size
			buffer.writeUInt16LE(entry.name.length, 28); // File name length (n)
			buffer.writeUInt16LE(0, 30); // Extra field length (m)
			buffer.writeUInt16LE(0, 32); // File comment length (k)
			buffer.writeUInt16LE(0, 34); // Disk number where file starts
			buffer.writeUInt16LE(0, 36); // Internal file attributes
			buffer.writeUInt32LE(0, 38); // External file attributes
			buffer.writeUInt32LE(entry.localHeaderOffset, 42); // Relative offset of local file header. This is the number of bytes between the start of the first disk on which the file occurs, and the start of the local file header. This allows software reading the central directory to locate the position of the file inside the .ZIP file.
			buffer.write(entry.name, 46, entry.name.length, "ascii"); // File name
			buffer.write("", 46 + entry.name.length, 0, "ascii"); // Extra field
			buffer.write("", 46 + entry.name.length, 0, "ascii"); // File comment
			return buffer;
		}



		private getEOCD(
			fileCount:number,
			directorySize:number,
			directoryOffset:number):Buffer
		{
			var buffer = Buffer.allocUnsafe(22);
			buffer.writeUInt32LE(0x06054b50, 0); // End of central directory signature
			buffer.writeUInt16LE(0, 4); // Number of this disk
			buffer.writeUInt16LE(0, 6); // Disk where the central directory starts
			buffer.writeUInt16LE(fileCount, 8); // Number of central directory records on this disk
			buffer.writeUInt16LE(fileCount, 10); // Total number of central directory records
			buffer.writeUInt32LE(directorySize, 12); // Size of central directory (bytes)
			buffer.writeUInt32LE(directoryOffset, 16); // Offset of start of central directory, relative to start of archive
			buffer.writeUInt16LE(0, 20); // Comment length
			buffer.write("", 22, 0, "ascii"); // Comment
			return buffer;
		}



		private compress(
			entry:ZipFileEntry,
			callback:Callback):void
		{
			if (entry.compressed)
				return callback();

			if (!entry.uncompressed && !entry.path)
			{
				this.inErrorState = true;
				logError("error while compressing " + entry.name);
				return callback();
			}

			kr3m.async.If.then(!entry.uncompressed, (thenDone) =>
			{
				fsLib.readFile(entry.path, (err:any, buffer:Buffer) =>
				{
					if (err)
					{
						this.inErrorState = true;
						logError("error while loading " + entry.path);
						return callback();
					}

					entry.uncompressed = buffer;
					thenDone();
				});
			}, () =>
			{
				entry.compressionMethod = 8;
				entry.generalPurposeFlags = 0;

				if (!entry.crc)
					entry.crc = this.crc.get32Bit(entry.uncompressed);

				zLib.deflateRaw(entry.uncompressed, (err:Error, compressed:Buffer) =>
				{
					if (err)
					{
						this.inErrorState = true;
						logError(err);
						return callback();
					}

					entry.compressed = compressed;
					callback();
				});
			});
		}



		private uncompress(
			entry:ZipFileEntry,
			callback:Callback):void
		{
			if (entry.uncompressed)
				return callback();

			if (!entry.path && !entry.compressed)
			{
				this.inErrorState = true;
				logError("error while uncompressing " + entry.name);
				return callback();
			}

			kr3m.async.If.thenElse(!entry.compressed, (thenDone) =>
			{
				fsLib.readFile(entry.path, (err:any, buffer:Buffer) =>
				{
					if (err)
					{
						this.inErrorState = true;
						logError("error while loading " + entry.path);
						return callback();
					}

					entry.uncompressed = buffer;
					thenDone();
				});
			}, (elseDone) =>
			{
				switch (entry.compressionMethod)
				{
					case 0:
						entry.uncompressed = entry.compressed;
						if (entry.crc != this.crc.get32Bit(entry.uncompressed))
						{
							this.inErrorState = true;
							logError("CRC mismatch for file", entry.name);
						}
						callback();
						return;

					case 8:
						zLib.inflateRaw(entry.compressed, (err:Error, uncompressed:Buffer) =>
						{
							if (err)
							{
								this.inErrorState = true;
								logError("error while uncompressing " + entry.name);
								return callback();
							}

							entry.uncompressed = uncompressed;
							if (entry.crc != this.crc.get32Bit(entry.uncompressed))
							{
								this.inErrorState = true;
								logError("CRC mismatch for file", entry.name);
							}
							callback();
						});
						return;

					default:
						this.inErrorState = true;
						logError("unsupported compression method", entry.compressionMethod);
						return callback();
				}
			});
		}



		private compressAll(
			callback:Callback):void
		{
			this.join.addCallback(() =>
			{
				kr3m.async.Loop.forEach(this.entries, (entry, next) =>
				{
					this.compress(entry, next);
				}, callback);
			});
		}



		private uncompressAll(
			callback:Callback):void
		{
			this.join.addCallback(() =>
			{
				kr3m.async.Loop.forEach(this.entries, (entry, next) =>
				{
					this.uncompress(entry, next);
				}, callback);
			});
		}



		public saveToBuffer(
			callback:(buffer:Buffer) => void):this
		{
			this.compressAll(() =>
			{
				var target = Buffer.allocUnsafe(0);
				var centralDirectory = Buffer.allocUnsafe(0);
				kr3m.async.Loop.forEach(this.entries, (entry, next) =>
				{
					entry.localHeaderOffset = target.length;
					centralDirectory = Buffer.concat([centralDirectory, this.getCentralDirectoryHeader(entry)]);
					target = Buffer.concat([target, this.getLocalHeader(entry), entry.compressed]);
					next();
				}, () =>
				{
					var eocd = this.getEOCD(this.entries.length, centralDirectory.length, target.length);
					target = Buffer.concat([target, centralDirectory, eocd]);
					callback(target);
				});
			});
			return this;
		}



		public saveToFile(
			path:string,
			callback?:SuccessCallback):this
		{
			this.saveToBuffer((buffer) =>
			{
				fsLib.writeFile(path, buffer, (err:Error) =>
				{
					if (err)
					{
						this.inErrorState = true;
						logError(err);
					}
					callback && callback(!err);
				});
			});
			return this;
		}



		public loadArchive(path:string):this
		{
			this.join.fork();
			this.inErrorState = false;
			this.entries = [];
			fsLib.readFile(path, (err:Error, buffer:Buffer) =>
			{
				if (err)
				{
					this.inErrorState = true;
					logError("error while loading zip archive", path);
					return this.join.done();
				}

				var offset = 0;
				while (true)
				{
					var result = this.readFile(buffer, offset);
					if (!result)
						break;

					if (!result.skip)
						this.entries.push(result.entry);
					offset = result.newOffset;
				}

				this.join.done();
			});
			return this;
		}



		public extractAll(
			targetFolder:string,
			callback?:SuccessCallback):this
		{
			if (this.inErrorState)
			{
				callback(false);
				return this;
			}

			this.uncompressAll(() =>
			{
				kr3m.async.Loop.forEach(this.entries, (entry, next) =>
				{
					var targetFile = (targetFolder + "/" + entry.name).replace(/[\/\\]+/g, "/");
					File.createFileFolder(targetFile, (success) =>
					{
						if (!success)
							return callback(false);

						fsLib.writeFile(targetFile, entry.uncompressed, (err:Error) =>
						{
							if (err)
							{
								logError(err);
								return callback && callback(false);
							}
							next();
						});
					});
				}, () => callback && callback(true));
			});
			return this;
		}
	}
}
