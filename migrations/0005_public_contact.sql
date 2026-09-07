alter table contact_messages alter column user_id drop not null;

create index if not exists contact_messages_email_created_idx
  on contact_messages (email, created_at desc);
