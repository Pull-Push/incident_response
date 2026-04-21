--
-- PostgreSQL database dump
--

-- Dumped from database version 16.10 (Postgres.app)
-- Dumped by pg_dump version 16.10 (Postgres.app)

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
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	BEGIN
		new.updated_at = NOW();
		return new;
	END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: customers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customers (
    name character varying(255) NOT NULL,
    dept character varying(255),
    address character varying(255) NOT NULL,
    city character varying(255) NOT NULL,
    state character varying(2) NOT NULL,
    zip character varying(10) NOT NULL,
    notes text,
    contact character varying(255) NOT NULL,
    phone character varying(20) NOT NULL,
    contract boolean DEFAULT false NOT NULL,
    lat double precision,
    long double precision,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    id integer NOT NULL,
    is_valid boolean DEFAULT true NOT NULL,
    created_by integer
);


--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- Name: incidents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.incidents (
    customer_id integer NOT NULL,
    make character varying NOT NULL,
    model character varying NOT NULL,
    serial character varying NOT NULL,
    location character varying NOT NULL,
    physical_damage boolean DEFAULT false,
    water_damage boolean DEFAULT false,
    incident_type character varying NOT NULL,
    notes text,
    technician_notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    tech_assigned integer,
    id integer NOT NULL,
    status character varying(255) NOT NULL,
    created_by integer,
    CONSTRAINT incident_status_check CHECK (((status)::text = ANY ((ARRAY['open'::character varying, 'pending'::character varying, 'in_progress'::character varying, 'complete'::character varying, 'cancelled'::character varying])::text[])))
);


--
-- Name: incident_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.incident_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: incident_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.incident_id_seq OWNED BY public.incidents.id;


--
-- Name: subsites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subsites (
    customer_id integer NOT NULL,
    address character varying(255),
    city character varying(255),
    state character varying(2),
    zip character varying(10),
    notes text,
    contact character varying(255) NOT NULL,
    phone character varying NOT NULL,
    lat double precision,
    long double precision,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    id integer NOT NULL,
    name character varying(255),
    is_valid boolean DEFAULT true NOT NULL
);


--
-- Name: subsites_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.subsites_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: subsites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.subsites_id_seq OWNED BY public.subsites.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    "position" character varying NOT NULL,
    is_manager boolean DEFAULT false NOT NULL,
    is_sales boolean DEFAULT false NOT NULL,
    is_service boolean DEFAULT false NOT NULL,
    employee_number integer NOT NULL,
    email character varying NOT NULL,
    hashed_pw character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    id integer NOT NULL,
    is_valid boolean DEFAULT true NOT NULL,
    phone character varying(20)
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- Name: incidents id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incidents ALTER COLUMN id SET DEFAULT nextval('public.incident_id_seq'::regclass);


--
-- Name: subsites id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subsites ALTER COLUMN id SET DEFAULT nextval('public.subsites_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: customers customers_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pk PRIMARY KEY (id);


--
-- Name: incidents incident_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incidents
    ADD CONSTRAINT incident_pk PRIMARY KEY (id);


--
-- Name: subsites subsites_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subsites
    ADD CONSTRAINT subsites_pk PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pk PRIMARY KEY (id);


--
-- Name: users users_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_unique UNIQUE (employee_number);


--
-- Name: incident_created_at_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX incident_created_at_idx ON public.incidents USING btree (created_at);


--
-- Name: incident_customer_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX incident_customer_id_idx ON public.incidents USING btree (customer_id);


--
-- Name: incident_tech_assigned_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX incident_tech_assigned_idx ON public.incidents USING btree (tech_assigned);


--
-- Name: subsites_customer_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX subsites_customer_id_idx ON public.subsites USING btree (customer_id);


--
-- Name: users_email_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX users_email_idx ON public.users USING btree (email);


--
-- Name: customers trigger_customers_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_customers_updated_at BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: incidents trigger_incident_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_incident_updated_at BEFORE UPDATE ON public.incidents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: subsites trigger_subsites_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_subsites_updated_at BEFORE UPDATE ON public.subsites FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: users trigger_users_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trigger_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: customers customers_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: incidents incident_customer_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incidents
    ADD CONSTRAINT incident_customer_fk FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- Name: incidents incident_tech_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incidents
    ADD CONSTRAINT incident_tech_fk FOREIGN KEY (tech_assigned) REFERENCES public.users(id);


--
-- Name: incidents incidents_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.incidents
    ADD CONSTRAINT incidents_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: subsites subsites_customer_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subsites
    ADD CONSTRAINT subsites_customer_fk FOREIGN KEY (customer_id) REFERENCES public.customers(id);


--
-- PostgreSQL database dump complete
--