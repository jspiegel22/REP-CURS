--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: adventure_category; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.adventure_category AS ENUM (
    'water',
    'land',
    'luxury',
    'family'
);


ALTER TYPE public.adventure_category OWNER TO neondb_owner;

--
-- Name: adventure_provider; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.adventure_provider AS ENUM (
    'Cabo Adventures',
    'Papillon Yachts'
);


ALTER TYPE public.adventure_provider OWNER TO neondb_owner;

--
-- Name: booking_type; Type: TYPE; Schema: public; Owner: neondb_owner
--

CREATE TYPE public.booking_type AS ENUM (
    'direct',
    'form'
);


ALTER TYPE public.booking_type OWNER TO neondb_owner;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: adventures; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.adventures (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    description text,
    image_url text NOT NULL,
    provider public.adventure_provider NOT NULL,
    duration text NOT NULL,
    current_price text NOT NULL,
    original_price text,
    discount text,
    min_age text,
    booking_type public.booking_type DEFAULT 'form'::public.booking_type NOT NULL,
    max_guests integer,
    category public.adventure_category,
    rating numeric,
    available_dates jsonb,
    included jsonb,
    requirements jsonb,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.adventures OWNER TO neondb_owner;

--
-- Name: adventures_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.adventures_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.adventures_id_seq OWNER TO neondb_owner;

--
-- Name: adventures_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.adventures_id_seq OWNED BY public.adventures.id;


--
-- Name: bookings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    user_id integer,
    listing_id integer,
    start_date timestamp without time zone NOT NULL,
    end_date timestamp without time zone NOT NULL,
    status text NOT NULL,
    form_data jsonb,
    points_earned integer,
    adventure_id integer
);


ALTER TABLE public.bookings OWNER TO neondb_owner;

--
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookings_id_seq OWNER TO neondb_owner;

--
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- Name: guide_submissions; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.guide_submissions (
    id integer NOT NULL,
    first_name text NOT NULL,
    email text NOT NULL,
    guide_type text NOT NULL,
    source text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    form_name text NOT NULL,
    submission_id text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    interest_areas jsonb DEFAULT '[]'::jsonb NOT NULL,
    last_name text,
    phone text,
    preferred_contact_method text,
    form_data jsonb DEFAULT '{}'::jsonb
);


ALTER TABLE public.guide_submissions OWNER TO neondb_owner;

--
-- Name: guide_submissions_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.guide_submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.guide_submissions_id_seq OWNER TO neondb_owner;

--
-- Name: guide_submissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.guide_submissions_id_seq OWNED BY public.guide_submissions.id;


--
-- Name: leads; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.leads (
    id integer NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    interest_type text NOT NULL,
    source text NOT NULL,
    status text DEFAULT 'new'::text NOT NULL,
    form_data jsonb,
    notes text,
    assigned_to text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT leads_interest_type_check CHECK ((interest_type = ANY (ARRAY['villa'::text, 'resort'::text, 'adventure'::text, 'wedding'::text, 'group_trip'::text, 'influencer'::text, 'concierge'::text]))),
    CONSTRAINT leads_status_check CHECK ((status = ANY (ARRAY['new'::text, 'contacted'::text, 'qualified'::text, 'converted'::text, 'lost'::text])))
);


ALTER TABLE public.leads OWNER TO neondb_owner;

--
-- Name: leads_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.leads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leads_id_seq OWNER TO neondb_owner;

--
-- Name: leads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.leads_id_seq OWNED BY public.leads.id;


--
-- Name: listings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.listings (
    id integer NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    type text NOT NULL,
    image_url text NOT NULL,
    price integer,
    location text NOT NULL,
    booking_type text NOT NULL,
    partner_id integer
);


ALTER TABLE public.listings OWNER TO neondb_owner;

--
-- Name: listings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.listings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.listings_id_seq OWNER TO neondb_owner;

--
-- Name: listings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.listings_id_seq OWNED BY public.listings.id;


--
-- Name: resorts; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.resorts (
    id integer NOT NULL,
    name text NOT NULL,
    rating numeric NOT NULL,
    review_count integer NOT NULL,
    price_level text NOT NULL,
    location text NOT NULL,
    description text NOT NULL,
    image_url text NOT NULL,
    amenities jsonb NOT NULL,
    bookings_today integer DEFAULT 0,
    google_url text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.resorts OWNER TO neondb_owner;

--
-- Name: resorts_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.resorts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resorts_id_seq OWNER TO neondb_owner;

--
-- Name: resorts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.resorts_id_seq OWNED BY public.resorts.id;


--
-- Name: rewards; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.rewards (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    points_required integer NOT NULL,
    type text NOT NULL,
    value numeric NOT NULL,
    active boolean DEFAULT true
);


ALTER TABLE public.rewards OWNER TO neondb_owner;

--
-- Name: rewards_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.rewards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rewards_id_seq OWNER TO neondb_owner;

--
-- Name: rewards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.rewards_id_seq OWNED BY public.rewards.id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO neondb_owner;

--
-- Name: social_shares; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.social_shares (
    id integer NOT NULL,
    user_id integer,
    listing_id integer,
    platform text NOT NULL,
    shared_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    points_earned integer DEFAULT 10
);


ALTER TABLE public.social_shares OWNER TO neondb_owner;

--
-- Name: social_shares_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.social_shares_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.social_shares_id_seq OWNER TO neondb_owner;

--
-- Name: social_shares_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.social_shares_id_seq OWNED BY public.social_shares.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    role text DEFAULT 'traveler'::text NOT NULL,
    points integer DEFAULT 0,
    level integer DEFAULT 1
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: villas; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.villas (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    bedrooms integer NOT NULL,
    bathrooms integer NOT NULL,
    max_guests integer NOT NULL,
    amenities jsonb DEFAULT '[]'::jsonb NOT NULL,
    image_url text NOT NULL,
    image_urls jsonb DEFAULT '[]'::jsonb NOT NULL,
    price_per_night numeric NOT NULL,
    location text NOT NULL,
    address text NOT NULL,
    latitude numeric,
    longitude numeric,
    trackhs_id text,
    last_synced_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.villas OWNER TO neondb_owner;

--
-- Name: villas_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.villas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.villas_id_seq OWNER TO neondb_owner;

--
-- Name: villas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.villas_id_seq OWNED BY public.villas.id;


--
-- Name: weather_cache; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.weather_cache (
    id integer NOT NULL,
    location text NOT NULL,
    data jsonb NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.weather_cache OWNER TO neondb_owner;

--
-- Name: weather_cache_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.weather_cache_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.weather_cache_id_seq OWNER TO neondb_owner;

--
-- Name: weather_cache_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.weather_cache_id_seq OWNED BY public.weather_cache.id;


--
-- Name: adventures id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.adventures ALTER COLUMN id SET DEFAULT nextval('public.adventures_id_seq'::regclass);


--
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- Name: guide_submissions id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guide_submissions ALTER COLUMN id SET DEFAULT nextval('public.guide_submissions_id_seq'::regclass);


--
-- Name: leads id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.leads ALTER COLUMN id SET DEFAULT nextval('public.leads_id_seq'::regclass);


--
-- Name: listings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.listings ALTER COLUMN id SET DEFAULT nextval('public.listings_id_seq'::regclass);


--
-- Name: resorts id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.resorts ALTER COLUMN id SET DEFAULT nextval('public.resorts_id_seq'::regclass);


--
-- Name: rewards id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.rewards ALTER COLUMN id SET DEFAULT nextval('public.rewards_id_seq'::regclass);


--
-- Name: social_shares id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.social_shares ALTER COLUMN id SET DEFAULT nextval('public.social_shares_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: villas id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.villas ALTER COLUMN id SET DEFAULT nextval('public.villas_id_seq'::regclass);


--
-- Name: weather_cache id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.weather_cache ALTER COLUMN id SET DEFAULT nextval('public.weather_cache_id_seq'::regclass);


--
-- Data for Name: adventures; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.adventures (id, title, slug, description, image_url, provider, duration, current_price, original_price, discount, min_age, booking_type, max_guests, category, rating, available_dates, included, requirements, created_at, updated_at) FROM stdin;
20	4-HOUR LUXURY CABO SAILING BOAT TOUR	luxury-sailing-boat	\N	https://cdn.sanity.io/images/esqfj3od/production/834cde8965aeeee934450fb9b385ed7ecfa36c16-608x912.webp?w=640&q=65&fit=clip&auto=format	Cabo Adventures	4 Hours	$104 USD	$149 USD	\N	Min 8 years old	form	\N	luxury	4.528032551874194	\N	["Equipment", "Transportation", "Professional Guide"]	["Comfortable clothing", "Sunscreen", "Water bottle"]	2025-03-19 04:16:56.269012	2025-03-19 04:16:56.269012
21	CABO DOLPHIN SWIM SIGNATURE	dolphin-swim-signature	\N	https://cdn.sanity.io/images/esqfj3od/production/bd7bfbf824efdf124cf41220ef1830bf4335a462-608x912.webp?w=640&q=65&fit=clip&auto=format	Cabo Adventures	40 Minutes	$146 USD	$209 USD	\N	Min. 4 years old	form	\N	family	4.6966250964522915	\N	["Equipment", "Transportation", "Professional Guide"]	["Comfortable clothing", "Sunscreen", "Water bottle"]	2025-03-19 04:16:56.293783	2025-03-19 04:16:56.293783
22	OUTDOOR ADVENTURE 4X4 + CABO ZIPLINE + RAPPEL	outdoor-adventure-4x4	\N	https://cdn.sanity.io/images/esqfj3od/production/82ad01cfa3a513e85d158016f76161a9460e5247-608x912.webp?w=640&q=65&fit=clip&auto=format	Cabo Adventures	3.5 Hours	$97 USD	$139 USD	\N	Min 8 years old	form	\N	land	4.595774713423704	\N	["Equipment", "Transportation", "Professional Guide"]	["Comfortable clothing", "Sunscreen", "Water bottle"]	2025-03-19 04:16:56.317533	2025-03-19 04:16:56.317533
23	CAMELS + ATV + LUNCH	camels-atv-lunch	\N	https://cdn.sanity.io/images/esqfj3od/production/35784d21127935173359fdf767ff0c62074ff0b5-608x912.webp?w=640&q=65&fit=clip&auto=format	Cabo Adventures	3 hours	$118 USD	$169 USD	\N	Min 8 years old	form	\N	land	4.5646623332044856	\N	["Equipment", "Transportation", "Professional Guide"]	["Comfortable clothing", "Sunscreen", "Water bottle"]	2025-03-19 04:16:56.341472	2025-03-19 04:16:56.341472
24	LUXURY CABO SUNSET CRUISE	luxury-sunset-cruise	\N	https://cdn.sanity.io/images/esqfj3od/production/56c52d182d39bb86c7c5d638d537684b4c376b1b-608x912.webp?w=640&q=65&fit=clip&auto=format	Cabo Adventures	2.5 Hours	$76 USD	$109 USD	\N	Min 8 years old	form	\N	luxury	4.815360635144571	\N	["Equipment", "Transportation", "Professional Guide"]	["Comfortable clothing", "Sunscreen", "Water bottle"]	2025-03-19 04:16:56.365998	2025-03-19 04:16:56.365998
25	CABO DOLPHIN EXPERIENCE	dolphin-experience	\N	https://cdn.sanity.io/images/esqfj3od/production/e561f483565d57da0f60f4b78b9d7e201e1719a5-608x912.webp?w=640&q=65&fit=clip&auto=format	Cabo Adventures	30 Min	$125 USD	$179 USD	\N	Min. 4 years old	form	\N	family	4.667054917358377	\N	["Equipment", "Transportation", "Professional Guide"]	["Comfortable clothing", "Sunscreen", "Water bottle"]	2025-03-19 04:16:56.389535	2025-03-19 04:16:56.389535
26	LUXURY TWO-BAY SNORKEL	luxury-two-bay	\N	https://cdn.sanity.io/images/esqfj3od/production/6408a4a1046222b51e2764397e57ab987ad17be3-608x912.webp?w=640&q=65&fit=clip&auto=format	Cabo Adventures	4 Hours	$97 USD	$139 USD	\N	Min 5 years old	form	\N	luxury	4.880441203764183	\N	["Equipment", "Transportation", "Professional Guide"]	["Comfortable clothing", "Sunscreen", "Water bottle"]	2025-03-19 04:16:56.412103	2025-03-19 04:16:56.412103
27	OUTBACK & CABO CAMEL RIDE	outback-camel-ride	\N	https://cdn.sanity.io/images/esqfj3od/production/87cb95d909eacc583b3bcd8d9e0f8ebf8cc2bf22-608x912.webp?w=640&q=65&fit=clip&auto=format	Cabo Adventures	3 Hours	$83 USD	$119 USD	\N	Min 5 years old	form	\N	land	4.585251316264396	\N	["Equipment", "Transportation", "Professional Guide"]	["Comfortable clothing", "Sunscreen", "Water bottle"]	2025-03-19 04:16:56.436472	2025-03-19 04:16:56.436472
28	LUXURY WHALE WATCHING IN CABO	luxury-whale-watching	\N	https://cdn.sanity.io/images/esqfj3od/production/76c1e97bb2129788a3907f7809aba1b85f328cbb-608x912.webp?w=640&q=65&fit=clip&auto=format	Cabo Adventures	2.5 Hours	$97 USD	$139 USD	\N	Min 5 years old	form	\N	luxury	4.732767406301041	\N	["Equipment", "Transportation", "Professional Guide"]	["Comfortable clothing", "Sunscreen", "Water bottle"]	2025-03-19 04:16:56.460818	2025-03-19 04:16:56.460818
29	SWIM WITH WHALE SHARKS IN CABO	swim-with-whale	\N	https://cdn.sanity.io/images/esqfj3od/production/ae2e87b46789cce6c375dea1ebb9c678fac559f3-608x912.webp?w=640&q=65&fit=clip&auto=format	Cabo Adventures	10 Hours	$202 USD	$289 USD	\N	Min 8 years old	form	\N	water	4.732884226643814	\N	["Equipment", "Transportation", "Professional Guide"]	["Comfortable clothing", "Sunscreen", "Water bottle"]	2025-03-19 04:16:56.484662	2025-03-19 04:16:56.484662
30	CABO WHALE WATCHING	whale-watching	\N	https://cdn.sanity.io/images/esqfj3od/production/98e3663ffb8c276a4a350d7f7815ec5592530bae-608x912.webp?w=640&q=65&fit=clip&auto=format	Cabo Adventures	2 Hours	$76 USD	$109 USD	\N	Min 5 years old	form	\N	water	4.745542507775062	\N	["Equipment", "Transportation", "Professional Guide"]	["Comfortable clothing", "Sunscreen", "Water bottle"]	2025-03-19 04:16:56.508564	2025-03-19 04:16:56.508564
31	BALANDRA BEACH & LA PAZ SNORKELING	balandra-beach-la	\N	https://cdn.sanity.io/images/esqfj3od/production/bda2f112b39b66afc2d7399b8f7d8e0315a31312-608x912.webp?w=640&q=65&fit=clip&auto=format	Cabo Adventures	4 Hours	$153 USD	$219 USD	\N	Min 5 years old	form	\N	water	4.69974467604789	\N	["Equipment", "Transportation", "Professional Guide"]	["Comfortable clothing", "Sunscreen", "Water bottle"]	2025-03-19 04:16:56.531048	2025-03-19 04:16:56.531048
32	LUXURY YACHT	luxury-yacht	\N	https://images.unsplash.com/photo-1544551763-46a013bb70d5	Papillon Yachts	4 Hours	$700 USD	\N	\N	\N	form	\N	luxury	4.6231395565416165	\N	["Professional & Certified Staff", "Friendly and bilingual crew", "Unlimited Open Bar", "Food Menu", "Water Toys"]	["Comfortable clothing", "Sunscreen", "Valid ID"]	2025-03-19 04:16:56.562222	2025-03-19 04:16:56.562222
\.


--
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.bookings (id, user_id, listing_id, start_date, end_date, status, form_data, points_earned, adventure_id) FROM stdin;
\.


--
-- Data for Name: guide_submissions; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.guide_submissions (id, first_name, email, guide_type, source, status, form_name, submission_id, created_at, updated_at, interest_areas, last_name, phone, preferred_contact_method, form_data) FROM stdin;
1	jeff	jeff@newpsmedia.com	Ultimate Cabo Guide 2025	website	pending	guide_download	StXGnBtUoFKgAkKLlYlgz	2025-03-25 16:28:47.100979	2025-03-25 16:28:47.100979	[]	\N	\N	\N	{}
2	Jeffrey	jeff@newpsmedia.com	Ultimate Cabo Guide 2025	website	pending	guide_download	XRcyS6WekpSepLUjUODL1	2025-03-25 16:36:17.255199	2025-03-25 16:36:17.255199	[]	\N	\N	\N	{}
3	Jeffrey	jeff@newpsmedia.com	Cabo San Lucas Travel Guide	website	pending	guide-download	8WotXsOS__pTNbdikQp6x	2025-03-27 16:47:18.100955	2025-03-27 16:47:18.100955	[]	\N	\N	\N	{}
4	josh	jeff@newpsmedia.com	Cabo San Lucas Travel Guide	website	pending	guide-download	R2gKPBbLpL6GdEPfJQD5o	2025-04-03 19:01:29.975413	2025-04-03 19:01:29.975413	[]	\N	\N	\N	{}
5	jeff	jeff@newpsmedia.com	Cabo San Lucas Travel Guide	website	pending	guide-download	55ZQTD8mCp2hvbRz9m1Sw	2025-04-04 21:18:56.723858	2025-04-04 21:18:56.723858	["Travel Guide"]	\N	222-222-2222	Email	{"tags": ["Guide Request", "Website"], "referrer": null, "ipAddress": null, "userAgent": null, "utmMedium": null, "utmSource": null, "utmCampaign": null}
6	jeff	jeff@newpsmedia.com	Cabo San Lucas Travel Guide	website	pending	guide-download	AgmwEtWDULU3QtiLwMfkE	2025-04-04 21:21:45.901162	2025-04-04 21:21:45.901162	["Travel Guide"]	\N	222-222-2222	Email	{"tags": null, "referrer": null, "ipAddress": null, "userAgent": null, "utmMedium": null, "utmSource": null, "utmCampaign": null}
7	Jeffrey Spiegel	spiegel.a.jeffrey@gmail.com	Cabo San Lucas Travel Guide	website	pending	guide-download	ywRSeN1A7gMNxexWgxtHO	2025-04-04 21:23:58.183535	2025-04-04 21:23:58.183535	["Travel Guide"]	\N	7742920948	Email	{"tags": null, "referrer": null, "ipAddress": null, "userAgent": null, "utmMedium": null, "utmSource": null, "utmCampaign": null}
\.


--
-- Data for Name: leads; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.leads (id, first_name, last_name, email, phone, interest_type, source, status, form_data, notes, assigned_to, created_at, updated_at) FROM stdin;
1	Jeffrey	Spiegel	jeff@newpsmedia.com	7742920948	concierge	luxury-concierge-page	new	\N		\N	2025-03-20 15:24:48.757228	2025-03-20 15:24:48.757228
2	Jeffrey	Spiegel	jeff@newpsmedia.com	7742920948	concierge	luxury-concierge-page	new	\N		\N	2025-03-20 15:24:51.148918	2025-03-20 15:24:51.148918
3	Jeffrey	Spiegel	jeff@newpsmedia.com	7742920948	concierge	luxury-concierge-page	new	\N		\N	2025-03-20 15:29:18.397852	2025-03-20 15:29:18.397852
\.


--
-- Data for Name: listings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.listings (id, title, description, type, image_url, price, location, booking_type, partner_id) FROM stdin;
\.


--
-- Data for Name: resorts; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.resorts (id, name, rating, review_count, price_level, location, description, image_url, amenities, bookings_today, google_url, created_at, updated_at) FROM stdin;
292	Casa Dorada Resort & Spa	4.5	1698	$	Casa Dorada Resort & Spa	5-star hotel	https://www.google.com/maps/place/Casa+Dorada+Resort+%26+Spa/data=!4m10!3m9!1s0x86af4afcd5a01b09:0xd99a34adb24fd432!5m2!4m1!1i2!8m2!3d22.8881266!4d-109.9049952!16s%2Fg%2F1tddsmrm!19sChIJCRug1fxKr4YRMtRPsq00mtk?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:20.550119	2025-03-17 21:24:20.550119
293	Waldorf Astoria Los Cabos Pedregal	4.8	1820	$	Waldorf Astoria Los Cabos Pedregal	5-star hotel	https://www.google.com/maps/place/Waldorf+Astoria+Los+Cabos+Pedregal/data=!4m10!3m9!1s0x86af4b525b2a8809:0x1de878484f2c3d7f!5m2!4m1!1i2!8m2!3d22.8747501!4d-109.912132!16s%2Fg%2F1thpx88r!19sChIJCYgqW1JLr4YRfz0sT0h46B0?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:20.579716	2025-03-17 21:24:20.579716
294	Montage Los Cabos	4.8	1320	$	Montage Los Cabos	5-star hotel	https://www.google.com/maps/place/Montage+Los+Cabos/data=!4m10!3m9!1s0x86af4c487fe29405:0x989dfda25e24f724!5m2!4m1!1i2!8m2!3d22.9301647!4d-109.8163781!16s%2Fg%2F11cly3tp06!19sChIJBZTif0hMr4YRJPckXqL9nZg?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:20.602709	2025-03-17 21:24:20.602709
295	Grand Velas	4.8	2984	$	Grand Velas	5-star hotel	https://www.google.com/maps/place/Grand+Velas/data=!4m10!3m9!1s0x86af4e70f5fdae39:0xdd31fe13668ab9ac!5m2!4m1!1i2!8m2!3d22.9683891!4d-109.7921846!16s%2Fg%2F11c509t_n1!19sChIJOa799XBOr4YRrLmKZhP-Md0?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:20.624569	2025-03-17 21:24:20.624569
296	Solaz, a Luxury Collection Resort, Los Cabos	4.5	547	$	Solaz	5-star hotel	https://www.google.com/maps/place/Solaz,+a+Luxury+Collection+Resort,+Los+Cabos/data=!4m10!3m9!1s0x86af4f3a8753c66d:0xd3c27314537cafff!5m2!4m1!1i2!8m2!3d22.974162!4d-109.7813192!16s%2Fg%2F11nx1_3t79!19sChIJbcZThzpPr4YR_698UxRzwtM?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:20.647942	2025-03-17 21:24:20.647942
297	Hilton Los Cabos Beach & Golf Resort	4.6	2497	$	Hilton Los Cabos Beach & Golf Resort	5-star hotel	https://www.google.com/maps/place/Hilton+Los+Cabos+Beach+%26+Golf+Resort/data=!4m10!3m9!1s0x86af4e1eaff0dea9:0x29bf336b902030e4!5m2!4m1!1i2!8m2!3d22.9814035!4d-109.7645158!16s%2Fg%2F11b6mqxctg!19sChIJqd7wrx5Or4YR5DAgkGszvyk?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Beach access"]	0		2025-03-17 21:24:20.670126	2025-03-17 21:24:20.670126
298	Esperanza, Auberge Resorts Collection	4.8	1178	$	Esperanza	5-star hotel	https://www.google.com/maps/place/Esperanza,+Auberge+Resorts+Collection/data=!4m10!3m9!1s0x86af4c81967a3e8d:0x664b07c95ddf8df8!5m2!4m1!1i2!8m2!3d22.9017065!4d-109.8526149!16s%2Fg%2F1hm4ml1p1!19sChIJjT56loFMr4YR-I3fXckHS2Y?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:20.692124	2025-03-17 21:24:20.692124
299	Zoëtry Casa del Mar Los Cabos	4.6	903	$	Zoëtry Casa del Mar Los Cabos	5-star hotel	https://www.google.com/maps/place/Zo%C3%ABtry+Casa+del+Mar+Los+Cabos/data=!4m10!3m9!1s0x81345fbc03ca8a85:0xb11b109b14edb207!5m2!4m1!1i2!8m2!3d22.976815!4d-109.7712473!16s%2Fg%2F12vrbsks6!19sChIJhYrKA7xfNIERB7LtFJsQG7E?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free Wi-Fi", "Beach access"]	0		2025-03-17 21:24:20.714889	2025-03-17 21:24:20.714889
300	Le Blanc Spa Resort Los Cabos All Inclusive Adults Only	4.5	1953	$	Le Blanc Spa Resort Los Cabos All Inclusive Adults Only	5-star hotel	https://www.google.com/maps/place/Le+Blanc+Spa+Resort+Los+Cabos+All+Inclusive+Adults+Only/data=!4m10!3m9!1s0x86af4ff376901a11:0x8977b697ebe4c869!5m2!4m1!1i2!8m2!3d22.9717572!4d-109.7856389!16s%2Fg%2F11cncy86rt!19sChIJERqQdvNPr4YRacjk65e2d4k?authuser=0&hl=en&rclk=1	["Pool", "Free parking", "Beach access", "Air-conditioned"]	0		2025-03-17 21:24:20.747784	2025-03-17 21:24:20.747784
301	Marquis Los Cabos, An All-Inclusive, Adults Only & No Timeshare Resort	4.5	1918	$	Marquis Los Cabos	5-star hotel	https://www.google.com/maps/place/Marquis+Los+Cabos,+An+All-Inclusive,+Adults+Only+%26+No+Timeshare+Resort/data=!4m10!3m9!1s0x86af4a7ef6a8f86d:0x86fdaa78078ddfe1!5m2!4m1!1i2!8m2!3d22.9862182!4d-109.7578952!16s%2Fg%2F1tqpzpkw!19sChIJbfio9n5Kr4YR4d-NB3iq_YY?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:20.770196	2025-03-17 21:24:20.770196
302	Diamante Cabo San Lucas	4.6	3288	$	Diamante Cabo San Lucas	4-star hotel	https://www.google.com/maps/place/Diamante+Cabo+San+Lucas/data=!4m10!3m9!1s0x86af358540000001:0xa7deb0ded19dc48a!5m2!4m1!1i2!8m2!3d22.8969766!4d-109.9823445!16s%2Fg%2F1tjy1yph!19sChIJAQAAQIU1r4YRisSd0d6w3qc?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking"]	0		2025-03-17 21:24:20.792607	2025-03-17 21:24:20.792607
303	The Cape, A Thompson Hotel, by Hyatt	4.7	1617	$	The Cape	5-star hotel	https://www.google.com/maps/place/The+Cape,+A+Thompson+Hotel,+by+Hyatt/data=!4m10!3m9!1s0x86af4b70b62941fd:0x78b79ea3013b4225!5m2!4m1!1i2!8m2!3d22.8986271!4d-109.8670559!16s%2Fg%2F11bw5098gd!19sChIJ_UEptnBLr4YRJUI7AaOet3g?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:20.815402	2025-03-17 21:24:20.815402
304	Hacienda del Mar Los Cabos, Autograph Collection	3.8	37	$	Hacienda del Mar Los Cabos	Hotel	https://www.google.com/maps/place/Hacienda+del+Mar+Los+Cabos,+Autograph+Collection/data=!4m10!3m9!1s0x86af4dc910314a39:0xccee797e41d4abe1!5m2!4m1!1i2!8m2!3d22.9157515!4d-109.8346842!16s%2Fg%2F11y33h5y7z!19sChIJOUoxEMlNr4YR4avUQX557sw?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:20.838459	2025-03-17 21:24:20.838459
305	Hacienda Beach Club & Residences	4.6	1403	$	Hacienda Beach Club & Residences	5-star hotel	https://www.google.com/maps/place/Hacienda+Beach+Club+%26+Residences/data=!4m10!3m9!1s0x86af4ae3df99b40d:0x4f2bffdd1a59de4a!5m2!4m1!1i2!8m2!3d22.8844783!4d-109.9062697!16s%2Fg%2F1hhk65ftl!19sChIJDbSZ3-NKr4YRSt5ZGt3_K08?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:20.861913	2025-03-17 21:24:20.861913
306	Las Ventanas al Paraiso, A Rosewood Resort	4.8	1383	$	Las Ventanas al Paraiso	5-star hotel	https://www.google.com/maps/place/Las+Ventanas+al+Paraiso,+A+Rosewood+Resort/data=!4m10!3m9!1s0x86af5a624b9a6307:0xd27847cf6d36f605!5m2!4m1!1i2!8m2!3d22.9788095!4d-109.7698828!16s%2Fg%2F1ygbbbdjf!19sChIJB2OaS2Jar4YRBfY2bc9HeNI?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:20.8842	2025-03-17 21:24:20.8842
307	Nobu Hotel Los Cabos	4.5	1555	$	Nobu Hotel Los Cabos	5-star hotel	https://www.google.com/maps/place/Nobu+Hotel+Los+Cabos/data=!4m10!3m9!1s0x86af35f8e86149d7:0xee9a19a2c35cfbae!5m2!4m1!1i2!8m2!3d22.8849373!4d-109.9835661!16s%2Fg%2F11gcxzl39v!19sChIJ10lh6Pg1r4YRrvtcw6IZmu4?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:20.906451	2025-03-17 21:24:20.906451
308	Pueblo Bonito Pacifica Golf & Spa Resort	4.5	1877	$$	Pueblo Bonito Pacifica Golf & Spa Resort	5-star hotel	https://www.google.com/maps/place/Pueblo+Bonito+Pacifica+Golf+%26+Spa+Resort/data=!4m10!3m9!1s0x86af4a913aa7857b:0x7a55ccc16575730c!5m2!4m1!1i2!8m2!3d22.8744327!4d-109.9392104!16s%2Fg%2F1tf_hvqv!19sChIJe4WnOpFKr4YRDHN1ZcHMVXo?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking"]	0		2025-03-17 21:24:20.927491	2025-03-17 21:24:20.927491
309	Grand Solmar Land's End Resort & Spa	4.5	534	$	Grand Solmar Land's End Resort & Spa	Hotel	https://www.google.com/maps/place/Grand+Solmar+Land%27s+End+Resort+%26+Spa/data=!4m10!3m9!1s0x86af4b206be3ffff:0x8739458f646f547b!5m2!4m1!1i2!8m2!3d22.8761456!4d-109.9034719!16s%2Fg%2F11fmz1npvg!19sChIJ___jayBLr4YRe1RvZI9FOYc?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:20.95031	2025-03-17 21:24:20.95031
310	Hyatt Vacation Club at Sirena del Mar	4.5	1262	$$	Hyatt Vacation Club at Sirena del Mar	4-star hotel	https://www.google.com/maps/place/Hyatt+Vacation+Club+at+Sirena+del+Mar/data=!4m10!3m9!1s0x86af4b7970ab6cfb:0x65397cac8c5e80c4!5m2!4m1!1i2!8m2!3d22.8997719!4d-109.8630616!16s%2Fg%2F1tdqp2hb!19sChIJ-2yrcHlLr4YRxIBejKx8OWU?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:20.976019	2025-03-17 21:24:20.976019
311	SUNSET Beach Golf & Spa Resort Pueblo Bonito	4.6	10558	$	SUNSET Beach Golf & Spa Resort Pueblo Bonito	5-star hotel	https://www.google.com/maps/place/SUNSET+Beach+Golf+%26+Spa+Resort+Pueblo+Bonito/data=!4m10!3m9!1s0x86af4a95c7f563db:0x26b2a5f500a6affd!5m2!4m1!1i2!8m2!3d22.8751357!4d-109.9303941!16s%2Fg%2F11bccjklpr!19sChIJ22P1x5VKr4YR_a-mAPWlsiY?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking"]	0		2025-03-17 21:24:20.997906	2025-03-17 21:24:20.997906
312	SUNSET Beach Golf & Spa Resort Pueblo Bonito	4.6	10558	$	SUNSET Beach Golf & Spa Resort Pueblo Bonito	5-star hotel	https://www.google.com/maps/place/SUNSET+Beach+Golf+%26+Spa+Resort+Pueblo+Bonito/data=!4m10!3m9!1s0x86af4a95c7f563db:0x26b2a5f500a6affd!5m2!4m1!1i2!8m2!3d22.8751357!4d-109.9303941!16s%2Fg%2F11bccjklpr!19sChIJ22P1x5VKr4YR_a-mAPWlsiY?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking"]	0		2025-03-17 21:24:21.020284	2025-03-17 21:24:21.020284
313	Hyatt Vacation Club at Sirena del Mar	4.5	1262	$$	Hyatt Vacation Club at Sirena del Mar	4-star hotel	https://www.google.com/maps/place/Hyatt+Vacation+Club+at+Sirena+del+Mar/data=!4m10!3m9!1s0x86af4b7970ab6cfb:0x65397cac8c5e80c4!5m2!4m1!1i2!8m2!3d22.8997719!4d-109.8630616!16s%2Fg%2F1tdqp2hb!19sChIJ-2yrcHlLr4YRxIBejKx8OWU?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:21.042656	2025-03-17 21:24:21.042656
314	Solmar Resort	4.5	3680	$	Solmar Resort	4-star hotel	https://www.google.com/maps/place/Solmar+Resort/data=!4m10!3m9!1s0x86af4ae07779bd89:0x4dee6b776a6925bf!5m2!4m1!1i2!8m2!3d22.876556!4d-109.9035334!16s%2Fg%2F1pt_cfwxr!19sChIJib15d-BKr4YRvyVpandr7k0?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:21.065539	2025-03-17 21:24:21.065539
315	Hilton Grand Vacations Club La Pacifica Los Cabos	4.7	748	$	Hilton Grand Vacations Club La Pacifica Los Cabos	4-star hotel	https://www.google.com/maps/place/Hilton+Grand+Vacations+Club+La+Pacifica+Los+Cabos/data=!4m10!3m9!1s0x86af4e1eb66b08b1:0x7c7f4e5ab53d443d!5m2!4m1!1i2!8m2!3d22.9819107!4d-109.7643094!16s%2Fg%2F11ftl3chf9!19sChIJsQhrth5Or4YRPUQ9tVpOf3w?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:21.086558	2025-03-17 21:24:21.086558
316	Vista Encantada Spa Resort & Residences	4.4	171	$	Vista Encantada Spa Resort & Residences	4-star hotel	https://www.google.com/maps/place/Vista+Encantada+Spa+Resort+%26+Residences/data=!4m10!3m9!1s0x86af4b007fd42367:0x9646023ba0bb8198!5m2!4m1!1i2!8m2!3d22.9039742!4d-109.8448321!16s%2Fg%2F11fm34m6lm!19sChIJZyPUfwBLr4YRmIG7oDsCRpY?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:21.10985	2025-03-17 21:24:21.10985
317	Grand Fiesta Americana Los Cabos All Inclusive Golf & Spa.	4.5	4775	$	Grand Fiesta Americana Los Cabos All Inclusive Golf & Spa.	5-star hotel	https://www.google.com/maps/place/Grand+Fiesta+Americana+Los+Cabos+All+Inclusive+Golf+%26+Spa./data=!4m10!3m9!1s0x86af4c42bb88ce47:0xda7a84944547a4ff!5m2!4m1!1i2!8m2!3d22.9207406!4d-109.829281!16s%2Fg%2F1tdn4jn7!19sChIJR86Iu0JMr4YR_6RHRZSEeto?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking"]	0		2025-03-17 21:24:21.132393	2025-03-17 21:24:21.132393
318	Villa La Estancia Cabo San Lucas	4.6	567	$	Villa La Estancia Cabo San Lucas	4-star hotel	https://www.google.com/maps/place/Villa+La+Estancia+Cabo+San+Lucas/data=!4m10!3m9!1s0x86af5081d7031c75:0x305f2e415eab079a!5m2!4m1!1i2!8m2!3d22.8941235!4d-109.8978216!16s%2Fg%2F12hkh68vg!19sChIJdRwD14FQr4YRmgerXkEuXzA?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking"]	0		2025-03-17 21:24:21.167065	2025-03-17 21:24:21.167065
355	Los Milagros Hotel	4.5	130	$	Los Milagros Hotel	2-star hotel	https://www.google.com/maps/place/Los+Milagros+Hotel/data=!4m10!3m9!1s0x86af4ae5635b49e9:0x344e78555a01a291!5m2!4m1!1i2!8m2!3d22.8849012!4d-109.9135293!16s%2Fg%2F1tdjrl60!19sChIJ6UlbY-VKr4YRkaIBWlV4TjQ?authuser=0&hl=en&rclk=1	["Pool", "Free parking", "Free Wi-Fi", "Air-conditioned"]	0		2025-03-17 21:24:22.040515	2025-03-17 21:24:22.040515
319	Dreams Los Cabos Suites Golf Resort & Spa	4.2	3178	$	Dreams Los Cabos Suites Golf Resort & Spa	5-star hotel	https://www.google.com/maps/place/Dreams+Los+Cabos+Suites+Golf+Resort+%26+Spa/data=!4m10!3m9!1s0x86af50850f57526d:0x11f4b2e0ba301410!5m2!4m1!1i2!8m2!3d22.9762426!4d-109.7769152!16s%2Fg%2F1thcssj8!19sChIJbVJXD4VQr4YREBQwuuCy9BE?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free Wi-Fi"]	0		2025-03-17 21:24:21.193678	2025-03-17 21:24:21.193678
320	Paradisus Los Cabos - Adults only - The Leading Hotels of the World	4.4	2432	$$	Paradisus Los Cabos - Adults only - The Leading Hotels of the World	5-star hotel	https://www.google.com/maps/place/Paradisus+Los+Cabos+-+Adults+only+-+The+Leading+Hotels+of+the+World/data=!4m10!3m9!1s0x86af5a5eed1362df:0x2bbfc4d3923ff237!5m2!4m1!1i2!8m2!3d22.980533!4d-109.76642!16s%2Fg%2F1td3rycf!19sChIJ32IT7V5ar4YRN_I_ktPEvys?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking"]	0		2025-03-17 21:24:21.218494	2025-03-17 21:24:21.218494
321	Hacienda Encantada Resort & Residences	4.5	3217	$	Hacienda Encantada Resort & Residences	4-star hotel	https://www.google.com/maps/place/Hacienda+Encantada+Resort+%26+Residences/data=!4m10!3m9!1s0x86af4c86694761ab:0x284a58367c3c9f97!5m2!4m1!1i2!8m2!3d22.9028761!4d-109.8462424!16s%2Fg%2F11c3k51rwx!19sChIJq2FHaYZMr4YRl588fDZYSig?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:21.241367	2025-03-17 21:24:21.241367
322	Villa del Arco Beach Resort & Spa	4.5	2198	$$	Villa del Arco Beach Resort & Spa	5-star hotel	https://www.google.com/maps/place/Villa+del+Arco+Beach+Resort+%26+Spa/data=!4m10!3m9!1s0x86af4b03ae506c0d:0xf495f181a2b33f4b!5m2!4m1!1i2!8m2!3d22.893875!4d-109.8988731!16s%2Fg%2F11b6d94pl7!19sChIJDWxQrgNLr4YRSz-zooHxlfQ?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking"]	0		2025-03-17 21:24:21.26338	2025-03-17 21:24:21.26338
323	The Towers at Pueblo Bonito Pacifica – Adults Only – All Inclusive	4.5	145	$	The Towers at Pueblo Bonito Pacifica – Adults Only – All Inclusive	4-star hotel	https://www.google.com/maps/place/The+Towers+at+Pueblo+Bonito+Pacifica+%E2%80%93+Adults+Only+%E2%80%93+All+Inclusive/data=!4m10!3m9!1s0x86af4a99cc6c809f:0x217bf0dfb500cf4b!5m2!4m1!1i2!8m2!3d22.8738007!4d-109.9381594!16s%2Fg%2F11c1xpz1z7!19sChIJn4BszJlKr4YRS88Atd_weyE?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking"]	0		2025-03-17 21:24:21.286854	2025-03-17 21:24:21.286854
324	1 Homes Preview Cabo	4.3	84	$	1 Homes Preview Cabo	5-star hotel	https://www.google.com/maps/place/1+Homes+Preview+Cabo/data=!4m10!3m9!1s0x86af4b410a41ab13:0x9f5a0ba49b947563!5m2!4m1!1i2!8m2!3d22.8844459!4d-109.9063538!16s%2Fg%2F11nmt3j_zq!19sChIJE6tBCkFLr4YRY3WUm6QLWp8?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:21.308852	2025-03-17 21:24:21.308852
325	Garza Blanca Resort & Spa Los Cabos	4	841	$	Garza Blanca Resort & Spa Los Cabos	5-star hotel	https://www.google.com/maps/place/Garza+Blanca+Resort+%26+Spa+Los+Cabos/data=!4m10!3m9!1s0x86af4fd83234b71b:0xc11c7b8b058c1547!5m2!4m1!1i2!8m2!3d22.9700122!4d-109.7887836!16s%2Fg%2F11g_vkqtmg!19sChIJG7c0MthPr4YRRxWMBYt7HME?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:21.333219	2025-03-17 21:24:21.333219
326	Montecristo Luxury Villas All Inclusive	4.8	124	$	Montecristo Luxury Villas All Inclusive	Hotel	https://www.google.com/maps/place/Montecristo+Luxury+Villas+All+Inclusive/data=!4m10!3m9!1s0x86af4a9487c93375:0x824177b8f7db92f9!5m2!4m1!1i2!8m2!3d22.8779786!4d-109.9280492!16s%2Fg%2F11gbk2167l!19sChIJdTPJh5RKr4YR-ZLb97h3QYI?authuser=0&hl=en&rclk=1	["Pool", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:21.357881	2025-03-17 21:24:21.357881
327	Villa Las Arenas	4.8	22	$	Villa Las Arenas	Indoor lodging	https://www.google.com/maps/place/Villa+Las+Arenas/data=!4m10!3m9!1s0x86af4b7dfd602a69:0xd1b7e867689b82b2!5m2!4m1!1i2!8m2!3d22.900023!4d-109.85506!16s%2Fg%2F11btv6c9cn!19sChIJaSpg_X1Lr4YRsoKbaGfot9E?authuser=0&hl=en&rclk=1	[]	0		2025-03-17 21:24:21.380925	2025-03-17 21:24:21.380925
328	Mar Del Cabo by VELAS RESORTS	4.7	183	$$	Mar Del Cabo by VELAS RESORTS	3-star hotel	https://www.google.com/maps/place/Mar+Del+Cabo+by+VELAS+RESORTS/data=!4m10!3m9!1s0x86af4fc1b3f2eed7:0x3846ae134155127b!5m2!4m1!1i2!8m2!3d22.9690292!4d-109.7910802!16s%2Fg%2F11gk5yjzg0!19sChIJ1-7ys8FPr4YRexJVQROuRjg?authuser=0&hl=en&rclk=1	["Pool", "Free Wi-Fi", "Beach access", "Air-conditioned"]	0		2025-03-17 21:24:21.404487	2025-03-17 21:24:21.404487
329	Cabo bay	0	0	$	Cabo bay	Resort hotel	https://www.google.com/maps/place/Cabo+bay/data=!4m10!3m9!1s0x86af4afcb554359f:0x8ddb51d0e0b73bcb!5m2!4m1!1i2!8m2!3d22.887717!4d-109.9064663!16s%2Fg%2F11wttq36xt!19sChIJnzVUtfxKr4YRyzu34NBR240?authuser=0&hl=en&rclk=1	[]	0		2025-03-17 21:24:21.432298	2025-03-17 21:24:21.432298
330	Ocean view beach suite	0	0	$	Ocean view beach suite	Resort hotel	https://www.google.com/maps/place/Ocean+view+beach+suite/data=!4m10!3m9!1s0x86af4e1ea510e95f:0x63fde3a5e9a7ac31!5m2!4m1!1i2!8m2!3d22.980793!4d-109.764244!16s%2Fg%2F11wtvs83b3!19sChIJX-kQpR5Or4YRMayn6aXj_WM?authuser=0&hl=en&rclk=1	[]	0		2025-03-17 21:24:21.45522	2025-03-17 21:24:21.45522
331	ME Cabo by Meliá	4.7	2153	$	ME Cabo by Meliá	5-star hotel	https://www.google.com/maps/place/ME+Cabo+by+Meli%C3%A1/data=!4m10!3m9!1s0x86af4a7dd84e9717:0x53af6fcbf21e3b90!5m2!4m1!1i2!8m2!3d22.889402!4d-109.904181!16s%2Fg%2F1pty6tk23!19sChIJF5dO2H1Kr4YRkDse8stvr1M?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:21.477362	2025-03-17 21:24:21.477362
332	Hard Rock Hotel Los Cabos | An All Inclusive Experience	4.7	7776	$	Hard Rock Hotel Los Cabos | An All Inclusive Experience	4-star hotel	https://www.google.com/maps/place/Hard+Rock+Hotel+Los+Cabos+%7C+An+All+Inclusive+Experience/data=!4m10!3m9!1s0x86af351a857efd8d:0xac796cf3472f2af8!5m2!4m1!1i2!8m2!3d22.8836926!4d-109.9807995!16s%2Fg%2F11f6mq51qm!19sChIJjf1-hRo1r4YR-CovR_Nseaw?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking"]	0		2025-03-17 21:24:21.501565	2025-03-17 21:24:21.501565
333	Pueblo Bonito Montecristo Estates Luxury Villas	4.6	893	$	Pueblo Bonito Montecristo Estates Luxury Villas	4-star hotel	https://www.google.com/maps/place/Pueblo+Bonito+Montecristo+Estates+Luxury+Villas/data=!4m10!3m9!1s0x86af4af0e08a2dcd:0x91a93077ecbf702f!5m2!4m1!1i2!8m2!3d22.877964!4d-109.928043!16s%2Fg%2F1trsyfwk!19sChIJzS2K4PBKr4YRL3C_7HcwqZE?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:21.525295	2025-03-17 21:24:21.525295
334	Corazón Cabo Resort & Spa	4.2	2231	$$	Corazón Cabo Resort & Spa	4-star hotel	https://www.google.com/maps/place/Coraz%C3%B3n+Cabo+Resort+%26+Spa/data=!4m10!3m9!1s0x86af4ae32356b2a3:0xf4862f3e4e1c059c!5m2!4m1!1i2!8m2!3d22.8873362!4d-109.9067348!16s%2Fg%2F1v_snn_g!19sChIJo7JWI-NKr4YRnAUcTj4vhvQ?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:21.5498	2025-03-17 21:24:21.5498
335	Live Aqua Private Residences Los Cabos	4.8	336	$	Live Aqua Private Residences Los Cabos	5-star hotel	https://www.google.com/maps/place/Live+Aqua+Private+Residences+Los+Cabos/data=!4m10!3m9!1s0x86af4c69caaf6c63:0x4128baf3aae4ab85!5m2!4m1!1i2!8m2!3d22.9229335!4d-109.8328892!16s%2Fg%2F11h01wz0c4!19sChIJY2yvymlMr4YRhavkqvO6KEE?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:21.575272	2025-03-17 21:24:21.575272
336	Los Cabos Golf Resort	4.4	605	$	Los Cabos Golf Resort	4-star hotel	https://www.google.com/maps/place/Los+Cabos+Golf+Resort/data=!4m10!3m9!1s0x86af4a53340ceaa5:0xe585695ae6e654c1!5m2!4m1!1i2!8m2!3d22.9071603!4d-109.9022063!16s%2Fg%2F11btv69z4r!19sChIJpeoMNFNKr4YRwVTm5lppheU?authuser=0&hl=en&rclk=1	["Pool", "Free parking", "Free Wi-Fi", "Air-conditioned"]	0		2025-03-17 21:24:21.599398	2025-03-17 21:24:21.599398
337	Villa La Valencia Beach Resort & Spa Los Cabos, México	4.1	561	$	Villa La Valencia Beach Resort & Spa Los Cabos	5-star hotel	https://www.google.com/maps/place/Villa+La+Valencia+Beach+Resort+%26+Spa+Los+Cabos,+M%C3%A9xico/data=!4m10!3m9!1s0x86af4f68bc8b466f:0xeb1b5dcb1f31d80f!5m2!4m1!1i2!8m2!3d22.9759799!4d-109.7785496!16s%2Fg%2F11j0rsfqjq!19sChIJb0aLvGhPr4YRD9gxH8tdG-s?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking"]	0		2025-03-17 21:24:21.624496	2025-03-17 21:24:21.624496
338	Playa Grande Resort & Grand Spa	4.5	2799	Unknown	Playa Grande Resort & Grand Spa	4-star hotel	https://www.google.com/maps/place/Playa+Grande+Resort+%26+Grand+Spa/data=!4m10!3m9!1s0x86af5081d7031c75:0xc369edbba0449ba6!5m2!4m1!1i2!8m2!3d22.8765328!4d-109.9084561!16s%2Fg%2F1hhh5kkz1!19sChIJdRwD14FQr4YRpptEoLvtacM?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Beach access"]	0		2025-03-17 21:24:21.647029	2025-03-17 21:24:21.647029
339	Sunrock Hotel & Suites Los Cabos	4.4	766	$	Sunrock Hotel & Suites Los Cabos	3-star hotel	https://www.google.com/maps/place/Sunrock+Hotel+%26+Suites+Los+Cabos/data=!4m10!3m9!1s0x86af4afc52da9e73:0x865d2ee1fb12a90d!5m2!4m1!1i2!8m2!3d22.8992286!4d-109.8667997!16s%2Fg%2F12vtcztdq!19sChIJc57aUvxKr4YRDakS--EuXYY?authuser=0&hl=en&rclk=1	["Pool", "Free parking", "Free Wi-Fi", "Beach access"]	0		2025-03-17 21:24:21.672903	2025-03-17 21:24:21.672903
340	Bahia Hotel & Beach House	4.3	539	$	Bahia Hotel & Beach House	4-star hotel	https://www.google.com/maps/place/Bahia+Hotel+%26+Beach+House/data=!4m10!3m9!1s0x86af4ae8ab3190cb:0xbad839ca7c90ab4b!5m2!4m1!1i2!8m2!3d22.8882434!4d-109.9058571!16s%2Fg%2F1tjl6bqw!19sChIJy5Axq-hKr4YRS6uQfMo52Lo?authuser=0&hl=en&rclk=1	["Pool", "Free Wi-Fi", "Beach access"]	0		2025-03-17 21:24:21.695267	2025-03-17 21:24:21.695267
341	Swuim up Junior Suite	0	0	$	Swuim up Junior Suite	Resort hotel	https://www.google.com/maps/place/Swuim+up+Junior+Suite/data=!4m10!3m9!1s0x86af4e1eb612ab29:0xe9c21aa89907d95a!5m2!4m1!1i2!8m2!3d22.981476!4d-109.764701!16s%2Fg%2F11wx9nb3h3!19sChIJKasSth5Or4YRWtkHmagawuk?authuser=0&hl=en&rclk=1	[]	0		2025-03-17 21:24:21.718104	2025-03-17 21:24:21.718104
342	Medano Hotel and Spa	4.5	797	$	Medano Hotel and Spa	4-star hotel	https://www.google.com/maps/place/Medano+Hotel+and+Spa/data=!4m10!3m9!1s0x86af4afc613b675f:0x8759acf4ddd1f6ca!5m2!4m1!1i2!8m2!3d22.8907565!4d-109.9067919!16s%2Fg%2F11c5btlzs0!19sChIJX2c7YfxKr4YRyvbR3fSsWYc?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking"]	0		2025-03-17 21:24:21.740203	2025-03-17 21:24:21.740203
343	Quivira Los Cabos Condos and Homes -Vacation Rentals	4	12	$	Quivira Los Cabos Condos and Homes -Vacation Rentals	Hotel	https://www.google.com/maps/place/Quivira+Los+Cabos+Condos+and+Homes+-Vacation+Rentals/data=!4m10!3m9!1s0x86af4a9a1b0bc5d7:0x4a913993b641b317!5m2!4m1!1i2!8m2!3d22.8782392!4d-109.9386921!16s%2Fg%2F11fxzw0jkg!19sChIJ18ULG5pKr4YRF7NBtpM5kUo?authuser=0&hl=en&rclk=1	[]	0		2025-03-17 21:24:21.763574	2025-03-17 21:24:21.763574
344	Sandos Finisterra	4.8	7610	Unknown	Sandos Finisterra	5-star hotel	https://www.google.com/maps/place/Sandos+Finisterra/data=!4m10!3m9!1s0x86af4ae771a2a83d:0x1cc62fe68d4c5ecb!5m2!4m1!1i2!8m2!3d22.8764546!4d-109.9102077!16s%2Fg%2F1q6j7v0zc!19sChIJPaiicedKr4YRy15MjeYvxhw?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking"]	0		2025-03-17 21:24:21.78542	2025-03-17 21:24:21.78542
345	Hotel Riu Palace Cabo San Lucas	4.4	13888	Unknown	Hotel Riu Palace Cabo San Lucas	5-star hotel	https://www.google.com/maps/place/Hotel+Riu+Palace+Cabo+San+Lucas/data=!4m10!3m9!1s0x86af4b088514f96b:0x1cb2226484702291!5m2!4m1!1i2!8m2!3d22.897555!4d-109.8910277!16s%2Fg%2F1td25wv7!19sChIJa_kUhQhLr4YRkSJwhGQishw?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking"]	0		2025-03-17 21:24:21.809603	2025-03-17 21:24:21.809603
346	The Residences at Hacienda Encantada	0	0	$	The Residences at Hacienda Encantada	Resort hotel	https://www.google.com/maps/place/The+Residences+at+Hacienda+Encantada/data=!4m10!3m9!1s0x86af4db583365607:0xd46fe2f01b6d62d0!5m2!4m1!1i2!8m2!3d22.904504!4d-109.848337!16s%2Fg%2F11wtwmrz07!19sChIJB1Y2g7VNr4YR0GJtG_Dib9Q?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:21.833287	2025-03-17 21:24:21.833287
347	El Encanto All Inclusive Resort	4	9	Unknown	El Encanto All Inclusive Resort	Hotel	https://www.google.com/maps/place/El+Encanto+All+Inclusive+Resort/data=!4m10!3m9!1s0x86af4d78cefeb75b:0x83c991ebbc2ccf52!5m2!4m1!1i2!8m2!3d22.903315!4d-109.8470792!16s%2Fg%2F11wj3yy8wk!19sChIJW7f-znhNr4YRUs8svOuRyYM?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking"]	0		2025-03-17 21:24:21.856682	2025-03-17 21:24:21.856682
348	Pueblo Bonito Blanco Los Cabos Beach Resort	4.7	3872	Unknown	Pueblo Bonito Blanco Los Cabos Beach Resort	5-star hotel	https://www.google.com/maps/place/Pueblo+Bonito+Blanco+Los+Cabos+Beach+Resort/data=!4m10!3m9!1s0x86af4afd697b58a5:0xb42b82d1df466c75!5m2!4m1!1i2!8m2!3d22.8898069!4d-109.9032276!16s%2Fg%2F11c1wr404l!19sChIJpVh7af1Kr4YRdWxG39GCK7Q?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:21.880466	2025-03-17 21:24:21.880466
349	Villa Del Palmar Beach Resort & Spa Cabo San Lucas	4.1	2927	Unknown	Villa Del Palmar Beach Resort & Spa Cabo San Lucas	3-star hotel	https://www.google.com/maps/place/Villa+Del+Palmar+Beach+Resort+%26+Spa+Cabo+San+Lucas/data=!4m10!3m9!1s0x86af4be660196c61:0xeda172f11147f5d2!5m2!4m1!1i2!8m2!3d22.894713!4d-109.8968656!16s%2Fg%2F11hkqf_pvf!19sChIJYWwZYOZLr4YR0vVHEfFyoe0?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking"]	0		2025-03-17 21:24:21.903093	2025-03-17 21:24:21.903093
350	Cabo Vista Hotel	4.7	591	$	Cabo Vista Hotel	3-star hotel	https://www.google.com/maps/place/Cabo+Vista+Hotel/data=!4m10!3m9!1s0x86af4af1d1d639b1:0x77e9ab3c4563e9da!5m2!4m1!1i2!8m2!3d22.886982!4d-109.9174895!16s%2Fg%2F11b6zq03m7!19sChIJsTnW0fFKr4YR2uljRTyr6Xc?authuser=0&hl=en&rclk=1	["Pool", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:21.924979	2025-03-17 21:24:21.924979
351	Club Cascadas de Baja	4.6	1383	Unknown	Club Cascadas de Baja	3-star hotel	https://www.google.com/maps/place/Club+Cascadas+de+Baja/data=!4m10!3m9!1s0x86af4b0288a0173f:0x5613e78441c20fa7!5m2!4m1!1i2!8m2!3d22.8911877!4d-109.9019144!16s%2Fg%2F1tfxh3nj!19sChIJPxegiAJLr4YRpw_CQYTnE1Y?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:21.94767	2025-03-17 21:24:21.94767
352	Corazón Cabo Resort & Spa	4.2	2231	$$	Corazón Cabo Resort & Spa	4-star hotel	https://www.google.com/maps/place/Coraz%C3%B3n+Cabo+Resort+%26+Spa/data=!4m10!3m9!1s0x86af4ae32356b2a3:0xf4862f3e4e1c059c!5m2!4m1!1i2!8m2!3d22.8873362!4d-109.9067348!16s%2Fg%2F1v_snn_g!19sChIJo7JWI-NKr4YRnAUcTj4vhvQ?authuser=0&hl=en&rclk=1	["Spa", "Pool", "Beach access"]	0		2025-03-17 21:24:21.969871	2025-03-17 21:24:21.969871
353	Corazón Cabo Resort & Spa	4.2	2231	$$	Corazón Cabo Resort & Spa	4-star hotel	https://www.google.com/maps/place/Coraz%C3%B3n+Cabo+Resort+%26+Spa/data=!4m10!3m9!1s0x86af4ae32356b2a3:0xf4862f3e4e1c059c!5m2!4m1!1i2!8m2!3d22.8873362!4d-109.9067348!16s%2Fg%2F1v_snn_g!19sChIJo7JWI-NKr4YRnAUcTj4vhvQ?authuser=0&hl=en&rclk=1	["Spa", "Pool", "Beach access"]	0		2025-03-17 21:24:21.994761	2025-03-17 21:24:21.994761
354	Pueblo Bonito Rosé Resort & Spa	4.5	4730	Unknown	Pueblo Bonito Rosé Resort & Spa	5-star hotel	https://www.google.com/maps/place/Pueblo+Bonito+Ros%C3%A9+Resort+%26+Spa/data=!4m10!3m9!1s0x85d1fec2725b848f:0x52d57dd63c4acdf3!5m2!4m1!1i2!8m2!3d22.8915245!4d-109.9038979!16s%2Fg%2F11b6lh_0hn!19sChIJj4RbcsL-0YUR881KPNZ91VI?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:22.018217	2025-03-17 21:24:22.018217
356	Marina Fiesta Resort & Spa	4.3	1501	Unknown	Marina Fiesta Resort & Spa	4-star hotel	https://www.google.com/maps/place/Marina+Fiesta+Resort+%26+Spa/data=!4m10!3m9!1s0x86af4ae484d2e9b3:0x271bb4a17aaef21e!5m2!4m1!1i2!8m2!3d22.8853704!4d-109.9087641!16s%2Fg%2F1tkb5jz6!19sChIJs-nShORKr4YRHvKueqG0Gyc?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:22.062471	2025-03-17 21:24:22.062471
357	Novaispania	4.8	296	Unknown	Novaispania	3-star hotel	https://www.google.com/maps/place/Novaispania/data=!4m10!3m9!1s0x86af4a9eadb6ac1d:0x8abb1347b3a40a76!5m2!4m1!1i2!8m2!3d22.8774043!4d-109.9423544!16s%2Fg%2F11dxdh0ht_!19sChIJHay2rZ5Kr4YRdgqks0cTu4o?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking"]	0		2025-03-17 21:24:22.085141	2025-03-17 21:24:22.085141
358	Fiesta Americana Vacation Club, Los Cabos	4.3	30	Unknown	Fiesta Americana Vacation Club	Resort hotel	https://www.google.com/maps/place/Fiesta+Americana+Vacation+Club,+Los+Cabos/data=!4m10!3m9!1s0x86af4c42d40cadab:0xb87712ebe48bc5f5!5m2!4m1!1i2!8m2!3d22.920902!4d-109.827975!16s%2Fg%2F11s1j73087!19sChIJq60M1EJMr4YR9cWL5OsSd7g?authuser=0&hl=en&rclk=1	[]	0		2025-03-17 21:24:22.108472	2025-03-17 21:24:22.108472
359	Penthouse at Pacific Dunes	0	0	Unknown	Penthouse at Pacific Dunes	Resort hotel	https://www.google.com/maps/place/Penthouse+at+Pacific+Dunes/data=!4m10!3m9!1s0x86af3590c418c431:0x860fe312a10e19a!5m2!4m1!1i2!8m2!3d22.9045121!4d-109.966476!16s%2Fg%2F11y319mf09!19sChIJMcQYxJA1r4YRmuEQKjH-YAg?authuser=0&hl=en&rclk=1	[]	0		2025-03-17 21:24:22.131132	2025-03-17 21:24:22.131132
360	Mantea Casa Cabo	5	44	Unknown	Mantea Casa Cabo	Villa	https://www.google.com/maps/place/Mantea+Casa+Cabo/data=!4m10!3m9!1s0x86af4b4934865e91:0x23c0b95fe4405e1d!5m2!4m1!1i2!8m2!3d22.8750885!4d-109.9141888!16s%2Fg%2F11h1g20g8w!19sChIJkV6GNElLr4YRHV5A5F-5wCM?authuser=0&hl=en&rclk=1	[]	0		2025-03-17 21:24:22.154421	2025-03-17 21:24:22.154421
361	Hotel Riu Santa Fe	4.1	11751	Unknown	Hotel Riu Santa Fe	5-star hotel	https://www.google.com/maps/place/Hotel+Riu+Santa+Fe/data=!4m10!3m9!1s0x86af4b065793097b:0x3fa3e5f4fc5b86a9!5m2!4m1!1i2!8m2!3d22.8994602!4d-109.8905456!16s%2Fg%2F11clsdf46q!19sChIJewmTVwZLr4YRqYZb_PTloz8?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking"]	0		2025-03-17 21:24:22.176275	2025-03-17 21:24:22.176275
362	Villa Bellissima	4.9	98	Unknown	Villa Bellissima	Villa	https://www.google.com/maps/place/Villa+Bellissima/data=!4m10!3m9!1s0x86af4add581b04eb:0x3dfce2752ff86c0b!5m2!4m1!1i2!8m2!3d22.8754233!4d-109.9132688!16s%2Fg%2F11cnysht3f!19sChIJ6wQbWN1Kr4YRC2z4L3Xi_D0?authuser=0&hl=en&rclk=1	["Pool", "Free parking", "Beach access"]	0		2025-03-17 21:24:22.199668	2025-03-17 21:24:22.199668
363	Cabo del Sol	4.6	1541	Unknown	Cabo del Sol	Golf course	https://www.google.com/maps/place/Cabo+del+Sol/data=!4m10!3m9!1s0x86af4c6538ed6735:0x74c6a2f85309daa9!5m2!4m1!1i2!8m2!3d22.9218099!4d-109.8439338!16s%2Fm%2F04vxnkj!19sChIJNWftOGVMr4YRqdoJU_iixnQ?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking"]	0		2025-03-17 21:24:22.222176	2025-03-17 21:24:22.222176
364	Prez Suite GrandSolmar Pacific Dunes	0	0	Unknown	Prez Suite GrandSolmar Pacific Dunes	Resort hotel	https://www.google.com/maps/place/Prez+Suite+GrandSolmar+Pacific+Dunes/data=!4m10!3m9!1s0x86af3590d244f063:0x7156bd42ad17f56e!5m2!4m1!1i2!8m2!3d22.904806!4d-109.967308!16s%2Fg%2F11ld3zzhwm!19sChIJY_BE0pA1r4YRbvUXrUK9VnE?authuser=0&hl=en&rclk=1	[]	0		2025-03-17 21:24:22.244147	2025-03-17 21:24:22.244147
365	Norman Diego's The Mexican Inn	3.9	129	$	Norman Diego's The Mexican Inn	2-star hotel	https://www.google.com/maps/place/Norman+Diego%27s+The+Mexican+Inn/data=!4m10!3m9!1s0x86af4afb0eb308e5:0xaadb9c0ffe0362bb!5m2!4m1!1i2!8m2!3d22.886576!4d-109.9146984!16s%2Fg%2F1tfx59_s!19sChIJ5QizDvtKr4YRu2ID_g-c26o?authuser=0&hl=en&rclk=1	["Free Wi-Fi", "Air-conditioned"]	0		2025-03-17 21:24:22.2663	2025-03-17 21:24:22.2663
366	Hotel Riu Palace Baja California	4.1	2189	Unknown	Hotel Riu Palace Baja California	Hotel	https://www.google.com/maps/place/Hotel+Riu+Palace+Baja+California/data=!4m10!3m9!1s0x86af4b99c0079ab5:0x972568d308c96254!5m2!4m1!1i2!8m2!3d22.8963261!4d-109.8945247!16s%2Fg%2F11hkthtj8g!19sChIJtZoHwJlLr4YRVGLJCNNoJZc?authuser=0&hl=en&rclk=1	["Pool", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:22.287483	2025-03-17 21:24:22.287483
367	Casa Las Rocas 7 Bedrooms 8.5 Bathrooms Villa	4.7	18	Unknown	Casa Las Rocas 7 Bedrooms 8.5 Bathrooms Villa	Villa	https://www.google.com/maps/place/Casa+Las+Rocas+7+Bedrooms+8.5+Bathrooms+Villa/data=!4m10!3m9!1s0x86af4e718ec2cb7d:0xc1a3848cd427476b!5m2!4m1!1i2!8m2!3d22.969259!4d-109.7894144!16s%2Fg%2F11ggbc8qgm!19sChIJfcvCjnFOr4YRa0cn1IyEo8E?authuser=0&hl=en&rclk=1	[]	0		2025-03-17 21:24:22.309717	2025-03-17 21:24:22.309717
368	Ty Warner Mansion	4.6	10	Unknown	Ty Warner Mansion	Resort hotel	https://www.google.com/maps/place/Ty+Warner+Mansion/data=!4m10!3m9!1s0x86af4e1ba7a90aad:0xbd43dd0149a2da25!5m2!4m1!1i2!8m2!3d22.9771176!4d-109.7671784!16s%2Fg%2F11ggngm509!19sChIJrQqppxtOr4YRJdqiSQHdQ70?authuser=0&hl=en&rclk=1	[]	0		2025-03-17 21:24:22.331695	2025-03-17 21:24:22.331695
369	The Ridge at Playa Grande	4.6	307	Unknown	The Ridge at Playa Grande	4-star hotel	https://www.google.com/maps/place/The+Ridge+at+Playa+Grande/data=!4m10!3m9!1s0x86af4ae0b4bd0235:0x1833b493e6d41abb!5m2!4m1!1i2!8m2!3d22.877365!4d-109.9079799!16s%2Fg%2F1tykvtvt!19sChIJNQK9tOBKr4YRuxrU5pO0Mxg?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:22.353551	2025-03-17 21:24:22.353551
370	Casa Dorado	4.6	34	Unknown	Casa Dorado	4-star hotel	https://www.google.com/maps/place/Casa+Dorado/data=!4m10!3m9!1s0x86af4ac01fa2421b:0xd0779b73da314b25!5m2!4m1!1i2!8m2!3d22.873783!4d-109.924519!16s%2Fg%2F1ptxvg0mn!19sChIJG0KiH8BKr4YRJUsx2nObd9A?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Beach access"]	0		2025-03-17 21:24:22.377538	2025-03-17 21:24:22.377538
371	Costa Brava	4.5	41	Unknown	Costa Brava	Hotel	https://www.google.com/maps/place/Costa+Brava/data=!4m10!3m9!1s0x86af4e7193e1867f:0xb29bf966195fffba!5m2!4m1!1i2!8m2!3d22.9692993!4d-109.7900161!16s%2Fg%2F11b6z43tc0!19sChIJf4bhk3FOr4YRuv9fGWb5m7I?authuser=0&hl=en&rclk=1	[]	0		2025-03-17 21:24:22.399399	2025-03-17 21:24:22.399399
372	Marina Junior Suite	5	1	Unknown	Marina Junior Suite	Resort hotel	https://www.google.com/maps/place/Marina+Junior+Suite/data=!4m10!3m9!1s0x86af4ae5c4ee08cd:0x54755904a1799094!5m2!4m1!1i2!8m2!3d22.8814102!4d-109.9114229!16s%2Fg%2F11rtcr6nv5!19sChIJzQjuxOVKr4YRlJB5oQRZdVQ?authuser=0&hl=en&rclk=1	[]	0		2025-03-17 21:24:22.421101	2025-03-17 21:24:22.421101
373	Casa Mateo	4.8	16	Unknown	Casa Mateo	4-star hotel	https://www.google.com/maps/place/Casa+Mateo/data=!4m10!3m9!1s0x86af4e72a440f9d1:0x7a387d40d83cb253!5m2!4m1!1i2!8m2!3d22.9713903!4d-109.7840148!16s%2Fg%2F11b73knz1h!19sChIJ0flApHJOr4YRU7I82EB9OHo?authuser=0&hl=en&rclk=1	[]	0		2025-03-17 21:24:22.443082	2025-03-17 21:24:22.443082
374	Puerta Cabos Village	4.7	297	Unknown	Puerta Cabos Village	4-star hotel	https://www.google.com/maps/place/Puerta+Cabos+Village/data=!4m10!3m9!1s0x86af4afe73355767:0xf5e1ed79fb37dc85!5m2!4m1!1i2!8m2!3d22.8948329!4d-109.9045861!16s%2Fg%2F1tzgk1zc!19sChIJZ1c1c_5Kr4YRhdw3-3nt4fU?authuser=0&hl=en&rclk=1	["Pool", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:22.465025	2025-03-17 21:24:22.465025
375	Villa Renata	4.9	27	Unknown	Villa Renata	Villa	https://www.google.com/maps/place/Villa+Renata/data=!4m10!3m9!1s0x86af4b817aff226d:0xa5199aea616e3a6c!5m2!4m1!1i2!8m2!3d22.8999277!4d-109.8561085!16s%2Fg%2F11b7gt6sqp!19sChIJbSL_eoFLr4YRbDpuYeqaGaU?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking"]	0		2025-03-17 21:24:22.487041	2025-03-17 21:24:22.487041
376	Paraíso del Mar ~ Cabo Sea Paradise	0	0	Unknown	Paraíso del Mar ~ Cabo Sea Paradise	Resort hotel	https://www.google.com/maps/place/Para%C3%ADso+del+Mar+~+Cabo+Sea+Paradise/data=!4m10!3m9!1s0x86af4b0222f70d33:0x1d09df5a26b86530!5m2!4m1!1i2!8m2!3d22.8935961!4d-109.9004287!16s%2Fg%2F11l75tcv85!19sChIJMw33IgJLr4YRMGW4JlrfCR0?authuser=0&hl=en&rclk=1	[]	0		2025-03-17 21:24:22.508896	2025-03-17 21:24:22.508896
377	La Vista Luxury Villas at Pedregal 'Pitahaya'	0	0	Unknown	La Vista Luxury Villas at Pedregal 'Pitahaya'	Resort hotel	https://www.google.com/maps/place/La+Vista+Luxury+Villas+at+Pedregal+%27Pitahaya%27/data=!4m10!3m9!1s0x86af4a67510d6027:0x5d180b5ea7392c86!5m2!4m1!1i2!8m2!3d22.9027837!4d-109.9266681!16s%2Fg%2F11q8vcq2rf!19sChIJJ2ANUWdKr4YRhiw5p14LGF0?authuser=0&hl=en&rclk=1	[]	0		2025-03-17 21:24:22.53096	2025-03-17 21:24:22.53096
378	Agave Azul	4.9	8	Unknown	Agave Azul	4-star hotel	https://www.google.com/maps/place/Agave+Azul/data=!4m10!3m9!1s0x86af4c65699f68bf:0xbef4da52a0681d16!5m2!4m1!1i2!8m2!3d22.917984!4d-109.84085!16s%2Fg%2F11b73rmvn9!19sChIJv2ifaWVMr4YRFh1ooFLa9L4?authuser=0&hl=en&rclk=1	["Pool", "Free Wi-Fi", "Air-conditioned"]	0		2025-03-17 21:24:22.552831	2025-03-17 21:24:22.552831
379	Villa del Toro Rojo	5	55	Unknown	Villa del Toro Rojo	Villa	https://www.google.com/maps/place/Villa+del+Toro+Rojo/data=!4m10!3m9!1s0x86af4ac2821badcb:0xa27428b3c3df88de!5m2!4m1!1i2!8m2!3d22.8749361!4d-109.9165305!16s%2Fg%2F11cm0y6rfr!19sChIJy60bgsJKr4YR3ojfw7ModKI?authuser=0&hl=en&rclk=1	["Pool", "Air-conditioned"]	0		2025-03-17 21:24:22.574584	2025-03-17 21:24:22.574584
380	The Bungalows Hotel	4.9	224	Unknown	The Bungalows Hotel	3-star hotel	https://www.google.com/maps/place/The+Bungalows+Hotel/data=!4m10!3m9!1s0x86af4aee69d0cd7b:0xe7e9a5cd795dfcfd!5m2!4m1!1i2!8m2!3d22.8837474!4d-109.9182655!16s%2Fg%2F1tg872hk!19sChIJe83Qae5Kr4YR_fxdec2l6ec?authuser=0&hl=en&rclk=1	["Pool", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:22.596651	2025-03-17 21:24:22.596651
381	Villa Marcella	4.6	30	Unknown	Villa Marcella	Villa	https://www.google.com/maps/place/Villa+Marcella/data=!4m10!3m9!1s0x86af4ac1ce77558f:0x1d4e14b08accbd0f!5m2!4m1!1i2!8m2!3d22.8730168!4d-109.9224446!16s%2Fg%2F1hjgx48bv!19sChIJj1V3zsFKr4YRD73MirAUTh0?authuser=0&hl=en&rclk=1	[]	0		2025-03-17 21:24:22.618783	2025-03-17 21:24:22.618783
382	PUEBLO BONITO	3	9	Unknown	PUEBLO BONITO	Resort hotel	https://www.google.com/maps/place/PUEBLO+BONITO/data=!4m10!3m9!1s0x86af4a8d887faac9:0x5c81fd4d7b852bb8!5m2!4m1!1i2!8m2!3d22.884824!4d-109.929601!16s%2Fg%2F11tdc_8ytc!19sChIJyap_iI1Kr4YRuCuFe039gVw?authuser=0&hl=en&rclk=1	[]	0		2025-03-17 21:24:22.63953	2025-03-17 21:24:22.63953
383	Casa Luca 6 Bedrooms 6.5 Bathrooms	4.4	5	Unknown	Casa Luca 6 Bedrooms 6.5 Bathrooms	Inn	https://www.google.com/maps/place/Casa+Luca+6+Bedrooms+6.5+Bathrooms/data=!4m10!3m9!1s0x86af4aea40932189:0xc4f965e5499d70b7!5m2!4m1!1i2!8m2!3d22.87597!4d-109.92149!16s%2Fg%2F11f3y30mct!19sChIJiSGTQOpKr4YRt3CdSeVl-cQ?authuser=0&hl=en&rclk=1	["Free Wi-Fi"]	0		2025-03-17 21:24:22.661363	2025-03-17 21:24:22.661363
384	L&L Collection Cigueña Blanca 2 Bedrooms	0	0	Unknown	L&L Collection Cigueña Blanca 2 Bedrooms	Resort hotel	https://www.google.com/maps/place/L%26L+Collection+Cigue%C3%B1a+Blanca+2+Bedrooms/data=!4m10!3m9!1s0x86af4e721f1cd85f:0x2cc4e5ce85adb2fb!5m2!4m1!1i2!8m2!3d22.9700228!4d-109.7886956!16s%2Fg%2F11x1vggnjc!19sChIJX9gcH3JOr4YR-7Kthc7lxCw?authuser=0&hl=en&rclk=1	[]	0		2025-03-17 21:24:22.683109	2025-03-17 21:24:22.683109
385	Marina View Villa	4.5	77	Unknown	Marina View Villa	Hotel	https://www.google.com/maps/place/Marina+View+Villa/data=!4m10!3m9!1s0x86af4aef4479ae71:0xcdc72cad85d48e21!5m2!4m1!1i2!8m2!3d22.8821606!4d-109.9148519!16s%2Fg%2F11f1gdmvnf!19sChIJca55RO9Kr4YRIY7Uha0sx80?authuser=0&hl=en&rclk=1	["Pool", "Free Wi-Fi"]	0		2025-03-17 21:24:22.70504	2025-03-17 21:24:22.70504
386	Collection O Casa Bella Hotel Boutique, Cabo San Lucas	4.8	89	Unknown	Collection O Casa Bella Hotel Boutique	3-star hotel	https://www.google.com/maps/place/Collection+O+Casa+Bella+Hotel+Boutique,+Cabo+San+Lucas/data=!4m10!3m9!1s0x86af4af1a459fa61:0xf68e27bcd301473f!5m2!4m1!1i2!8m2!3d22.8829691!4d-109.9141477!16s%2Fg%2F1hdznscrk!19sChIJYfpZpPFKr4YRP0cB07wnjvY?authuser=0&hl=en&rclk=1	["Pool", "Free Wi-Fi", "Air-conditioned"]	0		2025-03-17 21:24:22.727241	2025-03-17 21:24:22.727241
387	Marina Sol Residences and Resorts Cabo Gold Properties	4.8	4	Unknown	Marina Sol Residences and Resorts Cabo Gold Properties	Serviced accommodation	https://www.google.com/maps/place/Marina+Sol+Residences+and+Resorts+Cabo+Gold+Properties/data=!4m10!3m9!1s0x86af4bb65ffb2a67:0x1863ba07942bb59!5m2!4m1!1i2!8m2!3d22.8887285!4d-109.9071729!16s%2Fg%2F11fvmljmc5!19sChIJZyr7X7ZLr4YRWbtCeaA7hgE?authuser=0&hl=en&rclk=1	["Pool", "Spa", "Free parking", "Free Wi-Fi"]	0		2025-03-17 21:24:22.754414	2025-03-17 21:24:22.754414
388	Relaxing Family 2 Bedroom Suite @ Cabo San Lucas	5	1	Unknown	Relaxing Family 2 Bedroom Suite @ Cabo San Lucas	Hotel	https://www.google.com/maps/place/Relaxing+Family+2+Bedroom+Suite+@+Cabo+San+Lucas/data=!4m10!3m9!1s0x86af4c86c0778f6d:0xd2d718c3159365c4!5m2!4m1!1i2!8m2!3d22.902485!4d-109.847115!16s%2Fg%2F11gnsdrfc3!19sChIJbY93wIZMr4YRxGWTFcMY19I?authuser=0&hl=en&rclk=1	[]	0		2025-03-17 21:24:22.778759	2025-03-17 21:24:22.778759
389	Blarney Castle Inn	4.8	149	Unknown	Blarney Castle Inn	2-star hotel	https://www.google.com/maps/place/Blarney+Castle+Inn/data=!4m10!3m9!1s0x86af4aed00cbdc7d:0xfba9a6a21441111c!5m2!4m1!1i2!8m2!3d22.8836274!4d-109.9225119!16s%2Fg%2F1vq9mqp1!19sChIJfdzLAO1Kr4YRHBFBFKKmqfs?authuser=0&hl=en&rclk=1	["Pool", "Free parking", "Free Wi-Fi", "Air-conditioned"]	0		2025-03-17 21:24:22.804292	2025-03-17 21:24:22.804292
390	San Angel Suites	4.6	91	Unknown	San Angel Suites	3-star hotel	https://www.google.com/maps/place/San+Angel+Suites/data=!4m10!3m9!1s0x86af4ae6209ee1c9:0x8ab5041b841521a6!5m2!4m1!1i2!8m2!3d22.8794559!4d-109.9140336!16s%2Fg%2F1tvq4knh!19sChIJyeGeIOZKr4YRpiEVhBsEtYo?authuser=0&hl=en&rclk=1	["Free parking", "Free Wi-Fi", "Air-conditioned"]	0		2025-03-17 21:24:22.830312	2025-03-17 21:24:22.830312
391	MyrentalsMx	5	2	Unknown	MyrentalsMx	Cottage village	https://www.google.com/maps/place/MyrentalsMx/data=!4m10!3m9!1s0x86af4bbd00000001:0x9f6f2d2038c978ea!5m2!4m1!1i2!8m2!3d22.9165896!4d-109.8812117!16s%2Fg%2F11rd023tb0!19sChIJAQAAAL1Lr4YR6njJOCAtb58?authuser=0&hl=en&rclk=1	[]	0		2025-03-17 21:24:22.852523	2025-03-17 21:24:22.852523
\.


--
-- Data for Name: rewards; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.rewards (id, name, description, points_required, type, value, active) FROM stdin;
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.session (sid, sess, expire) FROM stdin;
\.


--
-- Data for Name: social_shares; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.social_shares (id, user_id, listing_id, platform, shared_at, points_earned) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, username, password, role, points, level) FROM stdin;
1	jefe	792a612c2cb536260f6875022817ae24388d124c6a15c8764dc58a251e4f68224a89d66d068c48454866d071fbf056d138986f67a98dfc08e4e460f3324bd276.7c3729360ebf7b74a799d26996f4acca	admin	0	1
\.


--
-- Data for Name: villas; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.villas (id, name, description, bedrooms, bathrooms, max_guests, amenities, image_url, image_urls, price_per_night, location, address, latitude, longitude, trackhs_id, last_synced_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: weather_cache; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.weather_cache (id, location, data, updated_at) FROM stdin;
1	cabo-san-lucas	{"condition": "sunny", "temperature": 28}	2025-03-13 00:47:48.436999
\.


--
-- Name: adventures_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.adventures_id_seq', 32, true);


--
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.bookings_id_seq', 1, false);


--
-- Name: guide_submissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.guide_submissions_id_seq', 7, true);


--
-- Name: leads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.leads_id_seq', 3, true);


--
-- Name: listings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.listings_id_seq', 1, false);


--
-- Name: resorts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.resorts_id_seq', 391, true);


--
-- Name: rewards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.rewards_id_seq', 1, false);


--
-- Name: social_shares_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.social_shares_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: villas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.villas_id_seq', 1, false);


--
-- Name: weather_cache_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.weather_cache_id_seq', 1, true);


--
-- Name: adventures adventures_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.adventures
    ADD CONSTRAINT adventures_pkey PRIMARY KEY (id);


--
-- Name: adventures adventures_slug_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.adventures
    ADD CONSTRAINT adventures_slug_key UNIQUE (slug);


--
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- Name: guide_submissions guide_submissions_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.guide_submissions
    ADD CONSTRAINT guide_submissions_pkey PRIMARY KEY (id);


--
-- Name: leads leads_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_pkey PRIMARY KEY (id);


--
-- Name: listings listings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_pkey PRIMARY KEY (id);


--
-- Name: resorts resorts_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.resorts
    ADD CONSTRAINT resorts_pkey PRIMARY KEY (id);


--
-- Name: rewards rewards_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.rewards
    ADD CONSTRAINT rewards_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: social_shares social_shares_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.social_shares
    ADD CONSTRAINT social_shares_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: villas villas_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.villas
    ADD CONSTRAINT villas_pkey PRIMARY KEY (id);


--
-- Name: villas villas_trackhs_id_key; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.villas
    ADD CONSTRAINT villas_trackhs_id_key UNIQUE (trackhs_id);


--
-- Name: weather_cache weather_cache_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.weather_cache
    ADD CONSTRAINT weather_cache_pkey PRIMARY KEY (id);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- Name: bookings bookings_adventure_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_adventure_id_fkey FOREIGN KEY (adventure_id) REFERENCES public.adventures(id);


--
-- Name: bookings bookings_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id);


--
-- Name: bookings bookings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: listings listings_partner_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_partner_id_fkey FOREIGN KEY (partner_id) REFERENCES public.users(id);


--
-- Name: social_shares social_shares_listing_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.social_shares
    ADD CONSTRAINT social_shares_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id);


--
-- Name: social_shares social_shares_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.social_shares
    ADD CONSTRAINT social_shares_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

