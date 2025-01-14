import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const BookingSystem = ({ professionalId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, [professionalId]);

  useEffect(() => {
    if (selectedDate && selectedService) {
      fetchAvailableSlots();
    }
  }, [selectedDate, selectedService]);

  const fetchServices = async () => {
    try {
      const response = await fetch(`/api/professionals/${professionalId}/services`);
      const data = await response.json();
      setServices(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching services:', error);
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const response = await fetch(`/api/availability`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          professionalId,
          serviceId: selectedService.id,
          date: selectedDate,
        }),
      });
      const data = await response.json();
      setAvailableSlots(data.slots);
    } catch (error) {
      console.error('Error fetching slots:', error);
    }
  };

  const handleBooking = async (slot) => {
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          professionalId,
          serviceId: selectedService.id,
          date: selectedDate,
          timeSlot: slot,
        }),
      });
      
      if (response.ok) {
        const session = await response.json();
        // Redirect to payment
        window.location.href = session.paymentUrl;
      }
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="booking-system">
      <h2>Book an Appointment</h2>
      
      <div className="service-selection">
        <h3>Select Service</h3>
        <div className="services-grid">
          {services.map((service) => (
            <div
              key={service.id}
              className={`service-card ${selectedService?.id === service.id ? 'selected' : ''}`}
              onClick={() => setSelectedService(service)}
            >
              <h4>{service.name}</h4>
              <p>{service.description}</p>
              <div className="service-details">
                <span>Duration: {service.duration} mins</span>
                <span>Price: ${service.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedService && (
        <div className="date-selection">
          <h3>Select Date</h3>
          <DatePicker
            selected={selectedDate}
            onChange={date => setSelectedDate(date)}
            minDate={new Date()}
            dateFormat="MMMM d, yyyy"
            className="date-picker"
          />
        </div>
      )}

      {selectedService && selectedDate && (
        <div className="time-slots">
          <h3>Available Time Slots</h3>
          <div className="slots-grid">
            {availableSlots.map((slot, index) => (
              <button
                key={index}
                className="time-slot"
                onClick={() => handleBooking(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingSystem;
