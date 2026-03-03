from Utils.email import send_booking_confirmation, send_guide_new_booking_alert
from Utils.calendar import add_event


def send_booking_notifications(booking):
        """Helper method to send emails and add calendar events."""
        # Send confirmation email to traveler
        try:
            send_booking_confirmation(
                to=booking.traveler.email,
                tourist_name=booking.traveler.get_full_name(),
                experience_title=booking.experience_title,
                booking_date=booking.slot.date.strftime("%B %d, %Y"),
                start_time = booking.slot.start_time.strftime('%H:%M:%S'),
                end_time = booking.slot.end_time.strftime('%H:%M:%S')
            )
        except Exception as e:
            print(f"Failed to send confirmation email: {e}")
        
        # Send notification to guide
        try:
            send_guide_new_booking_alert(
                to=booking.slot.experience.guide.email,
                guide_name=booking.slot.experience.guide.get_full_name(),
                tourist_name=booking.traveler.get_full_name(),
                experience_title=booking.experience_title,
                booking_date=booking.slot.date.strftime("%B %d, %Y")
            )
        except Exception as e:
            print(f"Failed to send guide notification: {e}")
        
        # Add to traveler's calendar (if authorized)
        try:
            if hasattr(booking.traveler, 'google_token'):
                start_time = f"{booking.slot.date}T{booking.slot.start_time.strftime('%H:%M:%S')}"
                end_time = f"{booking.slot.date}T{booking.slot.end_time.strftime('%H:%M:%S')}"
                
                location_name = ""
                if booking.slot.experience.location:
                    location_name = booking.slot.experience.location.place_name
                
                add_event(
                    user=booking.traveler,
                    title=booking.experience_title,
                    description=f"Booked with {booking.slot.experience.guide.get_full_name()}. {booking.guests} guest(s).",
                    start_datetime=start_time,
                    end_datetime=end_time,
                    location=location_name
                )
        except Exception as e:
            print(f"Failed to add calendar event: {e}")
