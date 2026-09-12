export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AppRole = 'user' | 'admin';
export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'archived';
export type CommentStatus = 'pending' | 'approved' | 'spam' | 'rejected';
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'archived';
export type EventAttendanceMode = 'in_person' | 'virtual' | 'hybrid';
export type ContentLocale = 'es' | 'en';
export type DynamicFormStatus = 'draft' | 'published' | 'archived';
export type DynamicFormFieldType =
  | 'short_text' | 'long_text' | 'email' | 'phone' | 'number' | 'date' | 'url'
  | 'select' | 'multiselect' | 'radio' | 'checkbox' | 'consent';
export type DynamicFormSubmissionStatus = 'new' | 'read' | 'archived' | 'spam';
export type DynamicFormNotificationStatus = 'pending' | 'sent' | 'failed';

type TableDefinition<Row, Insert, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type ProfileRow = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: AppRole;
  created_at: string;
  updated_at: string;
};

export type BlogSeriesRow = {
  id: string;
  parent_id: string | null;
  code: string;
  sort_order: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type BlogSeriesTranslationRow = {
  series_id: string;
  locale: ContentLocale;
  name: string;
  slug: string;
  description: string | null;
  seo_title: string | null;
  seo_description: string | null;
};

export type BlogPostRow = {
  id: string;
  series_id: string | null;
  status: ContentStatus;
  featured_image_url: string | null;
  author_name: string;
  is_featured: boolean;
  allow_comments: boolean;
  reading_time_minutes: number;
  published_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type BlogPostTranslationRow = {
  post_id: string;
  locale: ContentLocale;
  title: string;
  slug: string;
  excerpt: string | null;
  content_html: string;
  image_alt: string | null;
  seo_title: string | null;
  seo_description: string | null;
  focus_keyphrase: string | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  noindex: boolean;
  nofollow: boolean;
  schema_type: 'Article' | 'BlogPosting' | 'NewsArticle';
};

export type BlogTagRow = {
  id: string;
  code: string;
  created_at: string;
};

export type BlogTagTranslationRow = {
  tag_id: string;
  locale: ContentLocale;
  name: string;
  slug: string;
};

export type BlogPostTagRow = {
  post_id: string;
  tag_id: string;
};

export type BlogCommentRow = {
  id: string;
  post_id: string;
  parent_id: string | null;
  locale: ContentLocale;
  author_name: string;
  author_email: string;
  author_website: string | null;
  content: string;
  status: CommentStatus;
  moderated_by: string | null;
  moderated_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ApprovedBlogCommentRow = Pick<
  BlogCommentRow,
  'id' | 'post_id' | 'parent_id' | 'locale' | 'author_name' | 'author_website' | 'content' | 'created_at'
>;

export type EventVenueRow = {
  id: string;
  name: string;
  address_line_1: string | null;
  address_line_2: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  map_url: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type EventRow = {
  id: string;
  status: EventStatus;
  attendance_mode: EventAttendanceMode;
  starts_at: string;
  ends_at: string;
  timezone: string;
  all_day: boolean;
  venue_id: string | null;
  show_virtual_url: boolean;
  registration_url: string | null;
  registration_deadline: string | null;
  capacity: number | null;
  is_free: boolean;
  price_amount: number | null;
  currency: string;
  featured_image_url: string | null;
  is_featured: boolean;
  organizer_name: string | null;
  published_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type EventPrivateAccessRow = {
  event_id: string;
  virtual_url: string | null;
  organizer_email: string | null;
  updated_at: string;
};

export type PublicEventAccessRow = Pick<EventPrivateAccessRow, 'event_id' | 'virtual_url'>;

export type EventTranslationRow = {
  event_id: string;
  locale: ContentLocale;
  title: string;
  slug: string;
  excerpt: string | null;
  content_html: string;
  agenda_html: string | null;
  image_alt: string | null;
  seo_title: string | null;
  seo_description: string | null;
  focus_keyphrase: string | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  noindex: boolean;
  nofollow: boolean;
};

export type DynamicFormRow = {
  id: string;
  slug: string;
  name: string;
  status: DynamicFormStatus;
  title_es: string;
  title_en: string;
  description_es: string | null;
  description_en: string | null;
  submit_label_es: string;
  submit_label_en: string;
  success_message_es: string;
  success_message_en: string;
  notification_emails: string[];
  notification_subject: string | null;
  reply_to_field_key: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type DynamicFormFieldRow = {
  id: string;
  form_id: string;
  field_key: string;
  field_type: DynamicFormFieldType;
  label_es: string;
  label_en: string;
  placeholder_es: string | null;
  placeholder_en: string | null;
  help_text_es: string | null;
  help_text_en: string | null;
  required: boolean;
  options: Json;
  validation: Json;
  conditional_logic: Json | null;
  sort_order: number;
  width: 25 | 50 | 75 | 100;
  created_at: string;
  updated_at: string;
};

export type DynamicFormSubmissionRow = {
  id: string;
  form_id: string;
  locale: ContentLocale;
  status: DynamicFormSubmissionStatus;
  answers: Json;
  source_path: string | null;
  admin_notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
};

export type LegacyContentSourceRow = {
  id: string;
  source_system: string;
  source_kind: 'blog' | 'event' | 'media';
  source_id: string;
  source_url: string;
  target_table: 'blog_posts' | 'events' | 'storage.objects';
  target_id: string;
  checksum: string;
  source_payload: Json | null;
  imported_at: string;
};

export type DynamicFormNotificationRow = {
  id: string;
  submission_id: string;
  recipients: string[];
  subject: string;
  status: DynamicFormNotificationStatus;
  attempts: number;
  provider_id: string | null;
  last_error: string | null;
  attempted_at: string | null;
  sent_at: string | null;
  created_at: string;
};

export interface Database {
  public: {
    Tables: {
      profiles: TableDefinition<ProfileRow, {
        id: string;
        email?: string | null;
        full_name?: string | null;
        role?: AppRole;
        created_at?: string;
        updated_at?: string;
      }>;
      blog_series: TableDefinition<BlogSeriesRow, {
        id?: string;
        parent_id?: string | null;
        code: string;
        sort_order?: number;
        created_by?: string | null;
        created_at?: string;
        updated_at?: string;
      }>;
      blog_series_translations: TableDefinition<BlogSeriesTranslationRow, {
        series_id: string;
        locale: ContentLocale;
        name: string;
        slug: string;
        description?: string | null;
        seo_title?: string | null;
        seo_description?: string | null;
      }>;
      blog_posts: TableDefinition<BlogPostRow, {
        id?: string;
        series_id?: string | null;
        status?: ContentStatus;
        featured_image_url?: string | null;
        author_name?: string;
        is_featured?: boolean;
        allow_comments?: boolean;
        reading_time_minutes?: number;
        published_at?: string | null;
        created_by?: string | null;
        updated_by?: string | null;
        created_at?: string;
        updated_at?: string;
      }>;
      blog_post_translations: TableDefinition<BlogPostTranslationRow, {
        post_id: string;
        locale: ContentLocale;
        title: string;
        slug: string;
        excerpt?: string | null;
        content_html?: string;
        image_alt?: string | null;
        seo_title?: string | null;
        seo_description?: string | null;
        focus_keyphrase?: string | null;
        canonical_url?: string | null;
        og_title?: string | null;
        og_description?: string | null;
        og_image_url?: string | null;
        noindex?: boolean;
        nofollow?: boolean;
        schema_type?: 'Article' | 'BlogPosting' | 'NewsArticle';
      }>;
      blog_tags: TableDefinition<BlogTagRow, {
        id?: string;
        code: string;
        created_at?: string;
      }>;
      blog_tag_translations: TableDefinition<BlogTagTranslationRow, {
        tag_id: string;
        locale: ContentLocale;
        name: string;
        slug: string;
      }>;
      blog_post_tags: TableDefinition<BlogPostTagRow, BlogPostTagRow>;
      blog_comments: TableDefinition<BlogCommentRow, {
        id?: string;
        post_id: string;
        parent_id?: string | null;
        locale?: ContentLocale;
        author_name: string;
        author_email: string;
        author_website?: string | null;
        content: string;
        status?: CommentStatus;
        moderated_by?: string | null;
        moderated_at?: string | null;
        created_at?: string;
        updated_at?: string;
      }>;
      event_venues: TableDefinition<EventVenueRow, {
        id?: string;
        name: string;
        address_line_1?: string | null;
        address_line_2?: string | null;
        city?: string | null;
        region?: string | null;
        country?: string | null;
        postal_code?: string | null;
        latitude?: number | null;
        longitude?: number | null;
        map_url?: string | null;
        created_by?: string | null;
        created_at?: string;
        updated_at?: string;
      }>;
      events: TableDefinition<EventRow, {
        id?: string;
        status?: EventStatus;
        attendance_mode?: EventAttendanceMode;
        starts_at: string;
        ends_at: string;
        timezone?: string;
        all_day?: boolean;
        venue_id?: string | null;
        show_virtual_url?: boolean;
        registration_url?: string | null;
        registration_deadline?: string | null;
        capacity?: number | null;
        is_free?: boolean;
        price_amount?: number | null;
        currency?: string;
        featured_image_url?: string | null;
        is_featured?: boolean;
        organizer_name?: string | null;
        published_at?: string | null;
        created_by?: string | null;
        updated_by?: string | null;
        created_at?: string;
        updated_at?: string;
      }>;
      event_private_access: TableDefinition<EventPrivateAccessRow, {
        event_id: string;
        virtual_url?: string | null;
        organizer_email?: string | null;
        updated_at?: string;
      }>;
      event_translations: TableDefinition<EventTranslationRow, {
        event_id: string;
        locale: ContentLocale;
        title: string;
        slug: string;
        excerpt?: string | null;
        content_html?: string;
        agenda_html?: string | null;
        image_alt?: string | null;
        seo_title?: string | null;
        seo_description?: string | null;
        focus_keyphrase?: string | null;
        canonical_url?: string | null;
        og_title?: string | null;
        og_description?: string | null;
        og_image_url?: string | null;
        noindex?: boolean;
        nofollow?: boolean;
      }>;
      dynamic_forms: TableDefinition<DynamicFormRow, {
        id?: string;
        slug: string;
        name: string;
        status?: DynamicFormStatus;
        title_es: string;
        title_en: string;
        description_es?: string | null;
        description_en?: string | null;
        submit_label_es?: string;
        submit_label_en?: string;
        success_message_es?: string;
        success_message_en?: string;
        notification_emails?: string[];
        notification_subject?: string | null;
        reply_to_field_key?: string | null;
        created_by?: string | null;
        updated_by?: string | null;
        created_at?: string;
        updated_at?: string;
      }>;
      dynamic_form_fields: TableDefinition<DynamicFormFieldRow, {
        id?: string;
        form_id: string;
        field_key: string;
        field_type: DynamicFormFieldType;
        label_es: string;
        label_en: string;
        placeholder_es?: string | null;
        placeholder_en?: string | null;
        help_text_es?: string | null;
        help_text_en?: string | null;
        required?: boolean;
        options?: Json;
        validation?: Json;
        conditional_logic?: Json | null;
        sort_order?: number;
        width?: 25 | 50 | 75 | 100;
        created_at?: string;
        updated_at?: string;
      }>;
      dynamic_form_submissions: TableDefinition<DynamicFormSubmissionRow, {
        id?: string;
        form_id: string;
        locale: ContentLocale;
        status?: DynamicFormSubmissionStatus;
        answers: Json;
        source_path?: string | null;
        admin_notes?: string | null;
        reviewed_by?: string | null;
        reviewed_at?: string | null;
        created_at?: string;
      }>;
      legacy_content_sources: TableDefinition<LegacyContentSourceRow, {
        id?: string;
        source_system?: string;
        source_kind: 'blog' | 'event' | 'media';
        source_id: string;
        source_url: string;
        target_table: 'blog_posts' | 'events' | 'storage.objects';
        target_id: string;
        checksum: string;
        source_payload?: Json | null;
        imported_at?: string;
      }>;
      dynamic_form_notifications: TableDefinition<DynamicFormNotificationRow, {
        id?: string;
        submission_id: string;
        recipients: string[];
        subject: string;
        status?: DynamicFormNotificationStatus;
        attempts?: number;
        provider_id?: string | null;
        last_error?: string | null;
        attempted_at?: string | null;
        sent_at?: string | null;
        created_at?: string;
      }>;
    };
    Views: {
      approved_blog_comments: {
        Row: ApprovedBlogCommentRow;
        Relationships: [];
      };
      public_event_access: {
        Row: PublicEventAccessRow;
        Relationships: [];
      };
    };
    Functions: {
      save_blog_content: {
        Args: { p_id: string | null; p_record: Json; p_translations: Json; p_expected_updated_at: string | null; p_tag_ids: string[] };
        Returns: string;
      };
      save_event_content: {
        Args: { p_id: string | null; p_record: Json; p_translations: Json; p_expected_updated_at: string | null; p_access: Json };
        Returns: string;
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      submit_blog_comment: {
        Args: {
          p_post_id: string;
          p_parent_id: string | null;
          p_locale: string;
          p_author_name: string;
          p_author_email: string;
          p_author_website: string | null;
          p_content: string;
        };
        Returns: string;
      };
      submit_dynamic_form: {
        Args: { p_slug: string; p_locale: string; p_answers: Json; p_source_path?: string | null };
        Returns: string;
      };
      save_dynamic_form: {
        Args: { p_id: string | null; p_record: Json; p_fields: Json; p_expected_updated_at: string | null };
        Returns: string;
      };
    };
    Enums: {
      app_role: AppRole;
      content_status: ContentStatus;
      comment_status: CommentStatus;
      event_status: EventStatus;
      event_attendance_mode: EventAttendanceMode;
    };
    CompositeTypes: Record<PropertyKey, never>;
  };
}
