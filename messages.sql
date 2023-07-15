-- Table structure for the table `message`

CREATE TABLE IF NOT EXISTS public.message
(
    message_id serial PRIMARY KEY,
    message_subject character varying NOT NULL,
    message_body text NOT NULL,
    message_created timestamp with time zone NOT NULL DEFAULT now(),
    message_to integer NOT NULL,
    message_from integer NOT NULL,
    message_read boolean NOT NULL DEFAULT FALSE,
    message_archived boolean NOT NULL DEFAULT FALSE,
    FOREIGN KEY (message_to) REFERENCES public.user (user_id),
    FOREIGN KEY (message_from) REFERENCES public.user (user_id)
);
