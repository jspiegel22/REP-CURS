

SELECT pg_catalog.set_config('search_path', '', false);


CREATE TYPE public.adventure_category AS ENUM (
    'water',
    'land',
    'luxury',
    'family'
);


ALTER TYPE public.adventure_category OWNER TO neondb_owner;


CREATE TYPE public.adventure_provider AS ENUM (
    'Cabo Adventures',
    'Papillon Yachts'
);


ALTER TYPE public.adventure_provider OWNER TO neondb_owner;


CREATE TYPE public.booking_type AS ENUM (
    'direct',
    'form'
);


ALTER TYPE public.booking_type OWNER TO neondb_owner;




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


CREATE SEQUENCE public.adventures_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.adventures_id_seq OWNER TO neondb_owner;


ALTER SEQUENCE public.adventures_id_seq OWNED BY public.adventures.id;



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


CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookings_id_seq OWNER TO neondb_owner;


ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;



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


CREATE SEQUENCE public.guide_submissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.guide_submissions_id_seq OWNER TO neondb_owner;


ALTER SEQUENCE public.guide_submissions_id_seq OWNED BY public.guide_submissions.id;



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


CREATE SEQUENCE public.leads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leads_id_seq OWNER TO neondb_owner;


ALTER SEQUENCE public.leads_id_seq OWNED BY public.leads.id;



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


CREATE SEQUENCE public.listings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.listings_id_seq OWNER TO neondb_owner;


ALTER SEQUENCE public.listings_id_seq OWNED BY public.listings.id;



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


CREATE SEQUENCE public.resorts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resorts_id_seq OWNER TO neondb_owner;


ALTER SEQUENCE public.resorts_id_seq OWNED BY public.resorts.id;



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


CREATE SEQUENCE public.rewards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rewards_id_seq OWNER TO neondb_owner;


ALTER SEQUENCE public.rewards_id_seq OWNED BY public.rewards.id;



CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.session OWNER TO neondb_owner;


CREATE TABLE public.social_shares (
    id integer NOT NULL,
    user_id integer,
    listing_id integer,
    platform text NOT NULL,
    shared_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    points_earned integer DEFAULT 10
);


ALTER TABLE public.social_shares OWNER TO neondb_owner;


CREATE SEQUENCE public.social_shares_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.social_shares_id_seq OWNER TO neondb_owner;


ALTER SEQUENCE public.social_shares_id_seq OWNED BY public.social_shares.id;



CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    role text DEFAULT 'traveler'::text NOT NULL,
    points integer DEFAULT 0,
    level integer DEFAULT 1
);


ALTER TABLE public.users OWNER TO neondb_owner;


CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO neondb_owner;


ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;



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


CREATE SEQUENCE public.villas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.villas_id_seq OWNER TO neondb_owner;


ALTER SEQUENCE public.villas_id_seq OWNED BY public.villas.id;



CREATE TABLE public.weather_cache (
    id integer NOT NULL,
    location text NOT NULL,
    data jsonb NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.weather_cache OWNER TO neondb_owner;


CREATE SEQUENCE public.weather_cache_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.weather_cache_id_seq OWNER TO neondb_owner;


ALTER SEQUENCE public.weather_cache_id_seq OWNED BY public.weather_cache.id;




































ALTER TABLE ONLY public.adventures
    ADD CONSTRAINT adventures_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.adventures
    ADD CONSTRAINT adventures_slug_key UNIQUE (slug);



ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.guide_submissions
    ADD CONSTRAINT guide_submissions_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.resorts
    ADD CONSTRAINT resorts_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.rewards
    ADD CONSTRAINT rewards_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);



ALTER TABLE ONLY public.social_shares
    ADD CONSTRAINT social_shares_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);



ALTER TABLE ONLY public.villas
    ADD CONSTRAINT villas_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.villas
    ADD CONSTRAINT villas_trackhs_id_key UNIQUE (trackhs_id);



ALTER TABLE ONLY public.weather_cache
    ADD CONSTRAINT weather_cache_pkey PRIMARY KEY (id);



CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);



ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_adventure_id_fkey FOREIGN KEY (adventure_id) REFERENCES public.adventures(id);



ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id);



ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);



ALTER TABLE ONLY public.listings
    ADD CONSTRAINT listings_partner_id_fkey FOREIGN KEY (partner_id) REFERENCES public.users(id);



ALTER TABLE ONLY public.social_shares
    ADD CONSTRAINT social_shares_listing_id_fkey FOREIGN KEY (listing_id) REFERENCES public.listings(id);



ALTER TABLE ONLY public.social_shares
    ADD CONSTRAINT social_shares_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);



ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;



ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;



