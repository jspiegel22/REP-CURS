-- Create function to handle Airtable sync
CREATE OR REPLACE FUNCTION public.handle_airtable_sync()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the Edge Function to sync with Airtable
  PERFORM net.http_post(
    url := current_setting('app.settings.supabase_function_url') || '/airtable-sync',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
    ),
    body := jsonb_build_object(
      'table', TG_TABLE_NAME,
      'record', row_to_json(NEW)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for each table that needs Airtable sync
CREATE TRIGGER on_new_booking
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_airtable_sync();

CREATE TRIGGER on_new_lead
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_airtable_sync();

CREATE TRIGGER on_new_guide_submission
  AFTER INSERT ON guide_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_airtable_sync();

-- Create function to handle email notifications
CREATE OR REPLACE FUNCTION public.handle_email_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the Edge Function to send email
  PERFORM net.http_post(
    url := current_setting('app.settings.supabase_function_url') || '/send-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
    ),
    body := jsonb_build_object(
      'type', TG_TABLE_NAME,
      'record', row_to_json(NEW)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for email notifications
CREATE TRIGGER on_booking_confirmation
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_email_notification();

CREATE TRIGGER on_guide_download
  AFTER INSERT ON guide_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_email_notification();

-- Create function to handle ActiveCampaign sync
CREATE OR REPLACE FUNCTION public.handle_activecampaign_sync()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the Edge Function to sync with ActiveCampaign
  PERFORM net.http_post(
    url := current_setting('app.settings.supabase_function_url') || '/activecampaign-sync',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
    ),
    body := jsonb_build_object(
      'type', TG_TABLE_NAME,
      'record', row_to_json(NEW)
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for ActiveCampaign sync
CREATE TRIGGER on_new_contact
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_activecampaign_sync();

CREATE TRIGGER on_new_lead_contact
  AFTER INSERT ON leads
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_activecampaign_sync(); 