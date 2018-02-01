declare module cas
{
	interface ClientOptions
	{
		languageId?: string;
		ingamePopupIds?: string[];
	}
}
declare module cas
{
	interface CookieOptions
	{
		dontStoreGuestCookies?:boolean;
		deleteGuestCookies?:boolean;
	}
}
declare module cas
{
	const VERSION = "1.22.3.17";
	const DB_VERSION = "1.22.2.27";
}
declare module cas
{
	const TTL_SESSION: number;
	const TTL_JUMPPAD_BLOBS = 60;
	const TTL_HIGHSCORES_CACHE = 60;
	const TTL_STATS: number;
	const EVENT_POLLING_INTERVAL = 120;
	const EVENT_TTL: number;
	const BASE_URL = "http://localhost:8080/";
	const JUMPPAD_URL: string;
	const PASSWORD_SECURITY_LEVEL = 2;
	var LANGUAGES: string[];
	var FALLBACK_COUNTRY: string;
	const DEFAULT_USER_IMAGE_URL = "images/defaultUserImage.png";
	const USER_IMAGE_MAX_SIZE = 200000;
	const USER_IMAGE_WIDTH = 200;
	const USER_IMAGE_HEIGHT = 200;
	const MAX_LENGTH_CUSTOM_FIELD = 30;
	const MAX_LENGTH_EMAIL = 100;
	const MAX_LENGTH_PASSWORD = 50;
	const MAX_LENGTH_URL = 999;
	const MAX_LENGTH_USERNAME = 30;
	const LOGIN_ACTION_REGISTER = "REGISTER";
	const LOGIN_ACTION_LOGIN = "LOGIN";
	const LOGIN_ACTION_CONNECT = "CONNECT";
	const LOGIN_ACTIONS: string[];
	const CONNECT_WARNING_TIMEOUT = 1;
	const CASH_ID_EUR = "EUR";
	const CASH_IDS: string[];
	const CURRENCY_GOLD = "GOLD";
	const CURRENCIES: string[];
	const HIGHSCORE_PERIOD_ALLTIME = "ALLTIME";
	const HIGHSCORE_PERIOD_WEEKLY = "WEEKLY";
	const HIGHSCORE_PERIODS: string[];
	const FEATURE_CHANGE_EMAIL = "changeEmail";
	const FEATURE_CHANGE_PASSWORD = "changePassword";
	const FEATURE_CUSTOM_IMAGE = "customImage";
	const FEATURE_GRAPH_ACTION = "graphAction";
	const FEATURE_NOTIFY = "notify";
	const FEATURE_PAYMENT = "payment";
	const FEATURE_REQUEST = "request";
	const FEATURE_SHARE = "share";
	const ALL_FEATURES: string[];
	const FIELD_BIRTHDAY = "birthday";
	const FIELD_BOOLEAN = "boolean";
	const FIELD_DATE = "date";
	const FIELD_DATE_TIME = "dateTime";
	const FIELD_EMAIL = "email";
	const FIELD_FLUFF = "fluff";
	const FIELD_PASSWORD = "password";
	const FIELD_SELECTMANY = "selectMany";
	const FIELD_SELECTONE = "selectOne";
	const FIELD_TERMS_AND_CONDITIONS = "termsAndConditions";
	const FIELD_TEXT = "text";
	const FIELD_TIME = "time";
	const FIELD_TITLE = "title";
	const FIELD_URL = "url";
	const FIELD_USERNAME = "username";
	const EVENT_CONNECT = "CONNECT";
	const EVENT_CONNECT_FAILED = "CONNECT_FAILED";
	const EVENT_ERROR = "ERROR";
	const EVENT_INGAME_POPUP = "INGAME_POPUP";
	const EVENT_LOGIN = "LOGIN";
	const EVENT_LOGIN_FAILED = "LOGIN_FAILED";
	const EVENT_LOGOUT = "LOGOUT";
	const EVENT_ONLINE = "ONLINE";
	const EVENT_REGISTER = "REGISTER";
	const EVENT_REGISTER_FAILED = "REGISTER_FAILED";
	const EVENT_REQUEST = "REQUEST";
	const EVENT_WELCOME_CLOSED = "WELCOME_CLOSED";
	const POPUP_EMAIL_REMINDER = "POPUP_EMAIL_REMINDER";
	const POPUP_EMAIL_VALIDATED = "POPUP_EMAIL_VALIDATED";
	const POPUP_RAFFLE_EMAIL_VALIDATED = "POPUP_RAFFLE_EMAIL_VALIDATED";
	const POPUP_RESET_PASSWORD = "POPUP_RESET_PASSWORD";
	const POPUP_RESET_PASSWORD_RESULT = "POPUP_RESET_PASSWORD_RESULT";
	const POPUP_WELCOME = "POPUP_WELCOME";
	const POPUPS: string[];
	const MAIL_CATEGORY_CLAN_INVITATION = "CLAN_INVITATION";
	const MAIL_CATEGORY_REQUEST = "REQUEST";
	const MAIL_ANSWER_ACCEPT = "ACCEPT";
	const MAIL_ANSWER_DELETE = "DELETE";
	const MAIL_ANSWERS: string[];
	const CLAN_PRIV_DISBAND = "CLAN_PRIV_DISBAND";
	const CLAN_PRIV_INVITE = "CLAN_PRIV_INVITE";
	const CLAN_PRIV_KICK = "CLAN_PRIV_KICK";
	const CLAN_PRIVILEGES: string[];
	const ERROR_CURRENCY = "ERROR_CURRENCY";
	const ERROR_EMAIL_BLOCKED = "ERROR_EMAIL_BLOCKED";
	const ERROR_GAME_HAS_USERS = "ERROR_GAME_HAS_USERS";
	const ERROR_INIT_FAILED = "ERROR_INIT_FAILED";
	const ERROR_INVALID_URL = "ERROR_INVALID_URL";
	const ERROR_IS_MEMBER = "ERROR_IS_MEMBER";
	const ERROR_LIMIT = "ERROR_LIMIT";
	const ERROR_LOCAL_STORAGE = "ERROR_LOCAL_STORAGE";
	const ERROR_LOGGED_IN = "ERROR_LOGGED_IN";
	const ERROR_LOGIN_FAILED = "ERROR_LOGIN_FAILED";
	const ERROR_RAFFLE_HAS_PARTICIPANTS = "ERROR_RAFFLE_HAS_PARTICIPANTS";
	const STATUS_BACK = "STATUS_BACK";
	const STATUS_LOGOUT = "STATUS_LOGOUT";
	const STATUS_RECOVER_PASSWORD = "STATUS_RECOVER_PASSWORD";
	const STATUS_RESEND_VALIDATION = "STATUS_RESEND_VALIDATION";
	const STATUS_SHOW_ACCOUNT = "STATUS_SHOW_ACCOUNT";
	const STATUS_SHOW_REQUEST = "STATUS_SHOW_REQUEST";
	const STATUS_SHOW_WALLET = "STATUS_SHOW_WALLET";
	const TOKEN_RESET_PASSWORD = "RESET_PASSWORD";
	const TOKEN_VALIDATE_EMAIL = "VALIDATE_EMAIL";
	const TOKEN_VALIDATE_RAFFLE_EMAIL = "VALIDATE_RAFFLE_EMAIL";
	const TOKEN_TYPES: string[];
	const DEFAULT_REQUEST_IMAGE_URL = "images/defaultRequestImage.png";
	const REQUEST_ANSWER_ACCEPTED = "ACCEPTED";
	const REQUEST_ANSWER_DECLINED = "DECLINED";
	const REQUEST_ANSWERS: string[];
	const REQUEST_NEW_TTL: number;
	const REQUEST_OLD_TTL: number;
	const PAYMENT_INCOMPLETE_TTL: number;
	const SHOP_CATEGORY_PRIORITY: string[];
	function addAmounts(oldValue: number, delta: number, limit: number): number;
}
declare module cas.vo
{
	class User
	{
		id: number;
		name: string;
		imageUrl: string;
		countryId: string;
		languageId: string;
		customFields: any;
	}
}
declare module cas.vo
{
	class Friend extends cas.vo.User
	{
	}
}
declare module cas.vo
{
	class NotifyOptions
	{
		message: string;
		shortMessage: string;
		headline: string;
		url: string;
		imageUrl: string;
	}
}
declare module cas.vo
{
	class RequestOptions
	{
		dialogCaption: string;
		senderMessage: string;
		receiverHeadline: string;
		receiverMessage: string;
		acceptedMessage: string;
		declinedMessage: string;
		newFriendsOnly: boolean;
		limit: number;
		url: string;
		imageUrl: string;
		groupId: string;
		type: string;
		obj: string;
		customData: any;
		clanInviteId: string;
	}
}
declare module cas.vo
{
	class ShareOptions
	{
		message: string;
		headline: string;
		url: string;
		imageUrl: string;
	}
}
declare module cas.vo
{
	class AccountData
	{
		email: string;
		emailValidatedWhen: Date;
		newsletter: boolean;
		user: cas.vo.User;
	}
}
declare module cas.vo
{
	class ClanMember extends cas.vo.User
	{
		rank: number;
	}
}
declare module cas.vo
{
	class Clan
	{
		clanId: string;
		name: string;
		createdWhen: Date;
		joinedWhen: Date;
		ownRank: number;
		memberCount: number;
		admins: ClanMember[];
	}
}
declare module cas.vo
{
	class ClanHighscore extends Clan
	{
		offset: number;
		score: number;
	}
}
declare module cas.vo
{
	class ClanHighscoreOptions
	{
		category: string;
		clanId: string;
		offset: number;
		limit: number;
	}
}
declare module cas.vo
{
	class ClanHighscores
	{
		category: string;
		clansOffset: number;
		clansLimit: number;
		totalCount: number;
		clans: cas.vo.ClanHighscore[];
	}
}
declare module cas.vo
{
	class ClanInvitation extends Clan
	{
		invitedWhen: Date;
		from: User;
	}
}
declare module cas.vo
{
	class ClanMembers
	{
		clan: Clan;
		members: ClanMember[];
		membersOffset: number;
		membersLimit: number;
	}
}
declare module cas.vo
{
	class ClanMembership extends Clan
	{
		rank: number;
	}
}
declare module cas.vo
{
	class ClanSentInvitation extends User
	{
		invitedWhen: Date;
	}
}
declare module cas.vo
{
	class Event
	{
		name: string;
		params: any;
	}
}
declare module cas.vo
{
	class FriendCookie
	{
		user: cas.vo.User;
		cookies: any;
	}
}
declare module cas.vo
{
	class FriendCookies
	{
		entries: cas.vo.FriendCookie[];
	}
}
declare module cas.vo
{
	interface FieldMeta
	{
		id?: string;
		type?: string;
		value?: any;
		valueCaptions?: string[] |
		{
			[name: string]: string;
		};
		values?: string[] |
		{
			[name: string]: string;
		};
		limit?: number;
		minValue?: any;
		maxValue?: any;
		pattern?: string;
		patternErrorId?: string;
		captionId?: string;
		labelId?: string;
		callToActionId?: string;
		tokens?: any;
		optional?: boolean;
		isPublic?: boolean;
		tabIndex?: number;
		dontReturn?: boolean;
		clickStatus?: string;
		casType?: string;
		category?: string;
	}
}
declare module cas.vo
{
	class GraphActionOptions
	{
		action: string;
		objectType: string;
		obj: string;
	}
}
declare module cas.vo
{
	class HighscoreOptions
	{
		category: string;
		friendsOnly: boolean;
		clanId: string;
		period: string;
		offset: number;
		limit: number;
	}
}
declare module cas.vo
{
	class Highscore extends cas.vo.User
	{
		offset: number;
		score: number;
		updatedWhen: Date;
		bias: number;
		customData: any;
	}
}
declare module cas.vo
{
	class Highscores
	{
		userOffset: number;
		category: string;
		offset: number;
		limit: number;
		totalCount: number;
		entries: cas.vo.Highscore[];
	}
}
declare module cas.vo
{
	class MailItem
	{
		category: string;
		id: string;
		lastModified: Date;
		messageId: string;
		tokens:
		{
			[name: string]: string;
		};
		customMessage: string;
		imageUrl: string;
		customData: any;
		partnerUniqueKey: string;
		partner: User;
		answerOptions: string[];
		defaultAnswer: string;
	}
}
declare module cas.vo
{
	class MailBox
	{
		items: MailItem[];
	}
}
declare module cas.vo
{
	class NewHighscore
	{
		category: string;
		score: number;
		bias: number;
		customData: any;
	}
}
declare module cas.vo
{
	class Participation
	{
		email: string;
		newsletter: boolean;
		customFields: any;
	}
}
declare module cas.vo
{
	class Raffle
	{
		id: string;
		starts: Date;
		ends: Date;
		htmlCode: string;
		newsletter: boolean;
		sendValidationMail: boolean;
		name: string;
		customFieldMetas: cas.vo.FieldMeta[];
		participation: cas.vo.Participation;
	}
}
declare module cas.vo
{
	class Request
	{
		id: string;
		status: string;
		receiverMessage: string;
		acceptedMessage: string;
		declinedMessage: string;
		url: string;
		imageUrl: string;
		customData: any;
		customAnswerData: any;
		createdWhen: Date;
		answeredWhen: Date;
		uniqueKey: string;
		user: cas.vo.Friend;
	}
}
declare module cas.vo
{
	interface RequestAnswerOptions
	{
		requestId?: string;
		answerId?: string;
		customAnswerData?: any;
	}
}
declare module cas.vo
{
	class Requests
	{
		incoming: cas.vo.Request[];
		outgoing: cas.vo.Request[];
	}
}
declare module cas.vo
{
	class ShopItem
	{
		id: string;
		amount: number;
		ownAmount: number;
		maxAmount: number;
	}
}
declare module cas.vo
{
	class ShopPrice
	{
		id: string;
		price: number;
		currencyId: string;
		saved: number;
	}
}
declare module cas.vo
{
	class ShopPackage
	{
		id: string;
		categories: string[];
		imageUrl: string;
		prices: cas.vo.ShopPrice[];
		items: cas.vo.ShopItem[];
	}
}
declare module cas.vo
{
	class Shop
	{
		packages: cas.vo.ShopPackage[];
	}
}
declare module cas.vo
{
	class Currency
	{
		id: string;
		amount: number;
	}
}
declare module cas.vo
{
	class Wallet
	{
		currencies: cas.vo.Currency[];
	}
}
declare module cas.vo
{
	class Payment
	{
		id: string;
		providerData: any;
	}
}
declare module cas.ui
{
	interface DialogOptions
	{
		containerDivId?: string;
		showInNewTab?: boolean;
	}
}
declare module cas.ui
{
	interface LoginOptions extends DialogOptions
	{
		preselectMethod?: string;
		preselectAction?: string;
		initialFieldValues?: any;
	}
}
declare module cas.ui
{
	interface MailboxOptions extends DialogOptions
	{
		answerListener?: (mailItem: cas.vo.MailItem, answer: string) => void;
		hideAcceptAllButton?: boolean;
		hideInviteButton?: boolean;
	}
}
declare module cas.ui
{
	class UI
	{
		closeDialog(): void;
		getDialogHeight(callback:NumberCallback): void;
		showLoginDialog(options: cas.ui.LoginOptions, callback: (status: string, method?: string, action?: string) => void): void;
		showLoginDialog(options: cas.ui.LoginOptions): void;
		showLoginDialog(callback: (status: string, method?: string, action?: string) => void): void;
		showLoginDialog(): void;
		showAccountDialog(callback?: StatusCallback): void;
		showWelcomeDialog(options:cas.ui.DialogOptions, callback:StatusCallback):void;
		showWelcomeDialog(options:cas.ui.DialogOptions):void;
		showWelcomeDialog(callback:StatusCallback):void;
		showWelcomeDialog():void;
		showRaffleDialog(callback?: StatusCallback): void;
		showRequestDialog(requestOptions: cas.vo.RequestOptions, callback?: (status: string, requests: cas.vo.Request[]) => void): void;
		showMailboxDialog(options: cas.ui.MailboxOptions, callback: Callback): void;
		showMailboxDialog(options: cas.ui.MailboxOptions): void;
		showMailboxDialog(callback: Callback): void;
		showMailboxDialog(): void;
		showWalletDialog(callback?: Callback): void;
		showClanDialog(callback?: Callback): void;
		showShopDialog(callback?: Callback): void;
		showResetPasswordDialog(options: cas.ui.DialogOptions, callback: (status: string, password: string) => void): void;
	}
}
declare module cas.vo
{
	class InventoryItem
	{
		id: string;
		amount: number;
	}
}
declare module cas.stubs
{
	class AjaxRequest
	{
		cancel():void;
	}
}
declare module cas.vo
{
	class Inventory
	{
		items: cas.vo.InventoryItem[];
	}
}
declare module cas
{
	class Client
	{
		ui: cas.ui.UI;
		constructor(gameId: string, options?: cas.ClientOptions);
		getVersion(): string;
		resendValidationEmail(callback?: StatusCallback): void;
		setPassword(oldPassword: string, newPassword: string, callback: StatusCallback): void;
		setPasswordWithToken(token: string, newPassword: string, callback?: StatusCallback): void;
		handleQueryParams(callback: Callback, params?:
		{
			[name: string]: string;
		}): void;
		getFeatures(callback: (features:
		{
			[name: string]: boolean;
		}) => void): void;
		getUserFeatures(callback: (features:
		{
			[name: string]: boolean;
		}) => void): void;
		getLoginMethods(callback: (methods: string[]) => void): void;
		getToken(callback: (token: string) => void): void;
		addEventListener(eventListener: (eventName: string, params: any) => void): void;
		on(eventName: string, listener: AnyCallback): void;
		isLoggedIn(callback: (isLoggedIn: boolean) => void): void;
		connectAnonymous(username: string, callback: StatusCallback): void;
		registerUsername(username: string, password: string, callback: StatusCallback): void;
		loginUsername(username: string, password: string, callback: StatusCallback): void;
		registerEmail(username: string, email: string, password: string, newsletter: boolean, customValues:
		{
			[id: string]: any;
		}, callback: StatusCallback): void;
		registerEmail(username: string, email: string, password: string, callback: StatusCallback): void;
		registerEmail(email: string, password: string, callback: StatusCallback): void;
		loginEmail(email: string, password: string, callback: StatusCallback): void;
		sendPasswordRecoverMail(email: string, callback: StatusCallback): void;
		connectFacebook(callback: StatusCallback): void;
		logout(callback?: Callback): void;
		getUserId(callback: (userId: number) => void): void;
		getUser(callback: (user: cas.vo.User) => void): void;
		getUserAccount(callback: (account: cas.vo.AccountData) => void): void;
		saveUserAccount(account: cas.vo.AccountData, callback: StatusCallback): void;
		setName(name: string, callback: StatusCallback): void;
		setUserImageUrl(imageUrl: string, callback: StatusCallback): void;
		getLanguage(callback: (languageId: string) => void): void;
		setLanguage(languageId: string, callback?: StatusCallback): void;
		getFriends(callback: (friends: cas.vo.User[]) => void): void;
		createClan(name: string, callback: (status: string, clanId: string) => void): void;
		disbandClan(clanId: string, callback?: StatusCallback): void;
		getClanMemberships(userId: number, callback: (memberships: cas.vo.ClanMembership[]) => void): void;
		getClanMembers(clanId: string, offset: number, limit: number, callback: (members: cas.vo.ClanMembers) => void): void;
		getClanInvitations(callback: (invitations: cas.vo.ClanInvitation[]) => void): void;
		getSentClanInvitations(clanId: string, callback: (sentInvitations: cas.vo.ClanSentInvitation[]) => void): void;
		cancelClanInvitation(clanId: string, userId: number, callback?: StatusCallback): void;
		inviteUserToClan(clanId: string, userId: number, callback?: StatusCallback): void;
		leaveClan(clanId: string, callback?: StatusCallback): void;
		kickClanMember(clanId: string, userId: number, callback?: StatusCallback): void;
		answerClanInvitation(clanId: string, accept: boolean, callback?: StatusCallback): void;
		getClanHighscores(options: cas.vo.ClanHighscoreOptions, callback: (highscores: cas.vo.ClanHighscores) => void): void;
		share(messageOrOptions: string | cas.vo.ShareOptions, callback?: SuccessCallback): void;
		notify(messageOrOptions: string | cas.vo.NotifyOptions, userId?: number, callback?: SuccessCallback): void;
		graphAction(options: cas.vo.GraphActionOptions, callback?: SuccessCallback): void;
		setCookies(cookies:
		{
			[name: string]: any;
		}, options: CookieOptions, callback: SuccessCallback): void;
		setCookies(cookies:
		{
			[name: string]: any;
		}, callback: SuccessCallback): void;
		setCookies(cookies:
		{
			[name: string]: any;
		}, options: CookieOptions): void;
		setCookies(cookies:
		{
			[name: string]: any;
		}): void;
		setCookie(name: string, value: any, options: CookieOptions, callback: SuccessCallback): void;
		setCookie(name: string, value: any, callback: SuccessCallback): void;
		setCookie(name: string, value: any, options: CookieOptions): void;
		setCookie(name: string, value: any): void;
		getCookies(callback: (cookies:
		{
			[name: string]: any;
		}) => void): void;
		getCookie(name: string, callback: AnyCallback): void;
		getFriendCookies(callback: (friendCookies: cas.vo.FriendCookies) => void): void;
		setHighscore(category: string, score: number, callback?: SuccessCallback, customData?: any, bias?: number): void;
		setHighscores(entries: cas.vo.NewHighscore[], callback?: SuccessCallback): void;
		getUserHighscore(userId: number, options: cas.vo.HighscoreOptions, callback: CB<cas.vo.Highscore>): void;
		getHighscores(category: string, offset: number, limit: number, callback: CB<cas.vo.Highscores>): cas.stubs.AjaxRequest;
		getHighscores(options: cas.vo.HighscoreOptions, callback: CB<cas.vo.Highscores>): cas.stubs.AjaxRequest;
		getFriendHighscores(category: string, offset: number, limit: number, callback: CB<cas.vo.Highscores>): void;
		getExpectedRank(category: string, score: number, callback: (rank: number) => void): void;
		getExpectedRank(options: cas.vo.HighscoreOptions, score: number, callback: (rank: number) => void): void;
		hasMail(callback: (newMailsCount: number) => void): void;
		getMailBox(callback: (mailbox: cas.vo.MailBox) => void): void;
		getRequestCount(callback: (requestCount: number) => void): void;
		getRequests(callback: (requests: cas.vo.Requests) => void): void;
		answerRequest(requestId: string, answerId: string, callback: StatusCallback): void;
		answerRequest(requestId: string, answerId: string): void;
		answerRequest(options: cas.vo.RequestAnswerOptions, callback: StatusCallback): void;
		answerRequest(options: cas.vo.RequestAnswerOptions): void;
		deleteRequest(requestId: string, callback?: StatusCallback): void;
		getWallet(callback: (wallet: cas.vo.Wallet) => void): void;
		pay(currencyId: string, amount: number, comment: string, callback?: StatusCallback): void;
		getInventory(callback: (inventory: cas.vo.Inventory) => void): void;
		getShop(callback: (shop: cas.vo.Shop) => void): void;
		buyShopPackage(packageId: string, priceOrCurrencyId: string, callback: StatusCallback): void;
		consumeItem(itemId: string, amount: number, comment: string, callback?: StatusCallback): void;
		getRaffle(raffleId: string, callback: (raffle: cas.vo.Raffle) => void): void;
		participate(raffleId: string, participation: cas.vo.Participation, callback: StatusCallback): void;
		participate(raffleId: string, participation: cas.vo.Participation): void;
		participate(raffleId: string, callback: StatusCallback): void;
		participate(raffleId: string): void;
		participate(callback: StatusCallback): void;
		participate(): void;
		getTime(callback: CB<Date>): void;
		getShortUrl(url: string, callback: (shortUrl: string) => void): void;
		preload(): void;
	}
}
