'use client';

import { useState, useEffect } from 'react';
import AdminAuthWrapper from '../../components/AdminAuthWrapper';
import ImageUpload from '../../../components/ImageUpload';
import styles from './AdminCabs.module.css';

export default function AdminCabsPage() {
  const [cabs, setCabs] = useState([]);
  const [serviceType, setServiceType] = useState('cars');
  const [form, setForm] = useState({
    type: '',
    subtype: '',
    From: '',
    To: '',
    City: '',
    Hours: '',
    Car: '', // Car name
    Imgg: '', // Car image
    Price: '',
    Seats: '',
    Luggage: '',
    incrementPercent: 0,
    sbiLag: 0,
  });
  const [loading, setLoading] = useState(false);
  const [uniqueCars, setUniqueCars] = useState([]);
  const [editingCab, setEditingCab] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // New state for bulk update
  const [selectedCarForBulk, setSelectedCarForBulk] = useState('');
  const [bulkImageUrl, setBulkImageUrl] = useState('');
  const [bulkUpdating, setBulkUpdating] = useState(false);

  // New state for service type increments
  const [serviceIncrements, setServiceIncrements] = useState({
    cars: 0,
    roundtrips: 0,
    hourly: 0,
  });
  const [incrementUpdating, setIncrementUpdating] = useState(false);

  // Fetch all car names for dropdown
  const fetchAllUniqueCars = async () => {
    try {
      const serviceTypes = ['cars', 'roundtrips', 'hourly'];
      const allCars = new Map();
      for (const type of serviceTypes) {
        const res = await fetch(`/api/admin/cabs/${type}`);
        const data = await res.json();
        if (data?.data) {
          data.data.forEach(cab => {
            if (cab.Car) {
              const carName = cab.Car.trim();
              if (carName && !allCars.has(carName.toLowerCase())) {
                allCars.set(carName.toLowerCase(), carName);
              }
            }
          });
        }
      }
      setUniqueCars(Array.from(allCars.values()).sort());
    } catch (error) {
      console.error('Error fetching unique cars:', error);
      setUniqueCars([]);
    }
  };

  // Fetch cabs for current tab
  const fetchCabs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/cabs/${serviceType}`);
      const data = await res.json();
      setCabs(data?.data || []);
    } catch (error) {
      console.error('Error fetching cabs:', error);
      setCabs([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle service type increment update
  const handleServiceIncrementUpdate = async (typeKey) => {
    setIncrementUpdating(true);
    try {
      const incrementValue = serviceIncrements[typeKey];
      // Send request to update all cabs of this service type with the increment percentage
      const res = await fetch(`/api/admin/cabs/${typeKey}/increment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incrementPercent: incrementValue }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(`Price increment of ${incrementValue}% applied to all ${typeKey} cabs successfully.`);
        fetchCabs();
      } else {
        alert(data.error || 'Failed to update increments');
      }
    } catch (error) {
      console.error('Error updating service increment:', error);
      alert('Error updating increments');
    } finally {
      setIncrementUpdating(false);
    }
  };

  useEffect(() => {
    fetchAllUniqueCars();
  }, []);
  useEffect(() => {
    fetchCabs();
    setCurrentPage(1);
  }, [serviceType]);

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // Determine serviceType based on current tab
    const currentServiceType = serviceType;

    // Set type and subtype based on current serviceType
    const updatedForm = { ...form };
    if (currentServiceType === 'cars') {
      updatedForm.type = 'outstation';
      updatedForm.subtype = 'oneway';
    } else if (currentServiceType === 'roundtrips') {
      updatedForm.type = 'outstation';
      updatedForm.subtype = 'roundtrip';
    } else if (currentServiceType === 'hourly') {
      updatedForm.type = 'local';
      updatedForm.subtype = 'hourly';
    }

    const method = editingCab ? 'PUT' : 'POST';
    const url = editingCab
      ? `/api/admin/cabs/${currentServiceType}?id=${editingCab._id}`
      : `/api/admin/cabs/${currentServiceType}`;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedForm),
      });
      if (res.ok) {
        alert(`Cab ${editingCab ? 'updated' : 'added'} successfully`);
        setForm({
          type: '',
          subtype: '',
          From: '',
          To: '',
          City: '',
          Hours: '',
          Car: '',
          Imgg: '',
          Price: '',
          Seats: '',
          Luggage: '',
          incrementPercent: 0,
          sbiLag: 0,
        });
        setEditingCab(null);
        fetchCabs();
        fetchAllUniqueCars(); // refresh car list
      } else {
        alert('Error saving cab');
      }
    } catch (error) {
      console.error('Error saving cab:', error);
    }
  };

  const adjustIncrement = (id, newPercent) => {
    setCabs(prev => prev.map(cab => (cab._id === id ? { ...cab, incrementPercent: newPercent } : cab)));
  };

  const updateIncrement = async id => {
    const cab = cabs.find(c => c._id === id);
    if (!cab) return;
    try {
      await fetch(`/api/admin/cabs/${serviceType}?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incrementPercent: cab.incrementPercent || 0 }),
      });
      fetchCabs();
    } catch (error) {
      console.error('Error updating increment:', error);
    }
  };

  const getAdjustedPrice = cab => {
    if (cab.incrementPercent) {
      return cab.Price * (1 + cab.incrementPercent / 100);
    }
    return cab.Price;
  };

  const serviceTypes = [
    { key: 'cars', label: 'Cars (One Way)' },
    { key: 'roundtrips', label: 'Round Trips' },
    { key: 'hourly', label: 'Hourly Trips' },
  ];

  const handleEdit = cab => {
    setEditingCab(cab);
    setForm({
      type: cab.type || '',
      subtype: cab.subtype || '',
      From: cab.From || '',
      To: cab.To || '',
      City: cab.City || '',
      Hours: cab.Hours || '',
      Car: cab.Car || '',
      Imgg: cab.Imgg || '',
      Price: cab.Price || '',
      Seats: cab.Seats || '',
      Luggage: cab.Luggage || '',
      incrementPercent: cab.incrementPercent || 0,
      sbiLag: cab.sbiLag || 0,
    });
  };

  const handleDelete = async id => {
    if (!confirm('Delete this cab?')) return;
    try {
      await fetch(`/api/admin/cabs/${serviceType}?id=${id}`, { method: 'DELETE' });
      fetchCabs();
    } catch (error) {
      console.error('Error deleting cab:', error);
    }
  };

  // New handler for bulk image update
  const handleBulkImageUpdate = async () => {
    if (!selectedCarForBulk) {
      alert('Please select a car for bulk image update');
      return;
    }
    if (!bulkImageUrl) {
      alert('Please upload/select an image for bulk update');
      return;
    }
    setBulkUpdating(true);
    try {
      const res = await fetch('/api/cars', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ car: selectedCarForBulk, imgg: bulkImageUrl }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message || 'Bulk image update successful');
        setSelectedCarForBulk('');
        setBulkImageUrl('');
        fetchCabs();
        fetchAllUniqueCars();
      } else {
        alert(data.error || 'Bulk image update failed');
      }
    } catch (error) {
      console.error('Error in bulk image update:', error);
      alert('Bulk image update failed due to error');
    } finally {
      setBulkUpdating(false);
    }
  };

  return (
    <AdminAuthWrapper>
      <div className={styles.container}>
        <h1>Admin: Manage Cabs</h1>

        {/* Tabs */}
        <div className={styles.tabs}>
          {serviceTypes.map(type => (
            <button
              key={type.key}
              className={`${styles.tab} ${serviceType === type.key ? styles.active : ''}`}
              onClick={() => setServiceType(type.key)}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Bulk Image Update Section */}
        <div className={styles.bulkUpdateSection}>
          <h2>Bulk Image Update</h2>
          <div className={styles.row}>
            <select
              value={selectedCarForBulk}
              onChange={e => setSelectedCarForBulk(e.target.value)}
              className={styles.select}
            >
              <option value="">Select Car</option>
              {uniqueCars.map(car => (
                <option key={car} value={car}>
                  {car}
                </option>
              ))}
            </select>
          </div>
          <ImageUpload
            onUploadSuccess={url => setBulkImageUrl(url)}
            currentImage={bulkImageUrl}
            label="Select New Image"
          />
          <div className={styles.buttonRow}>
            <button onClick={handleBulkImageUpdate} disabled={bulkUpdating}>
              {bulkUpdating ? 'Updating...' : 'Update Image for Selected Car'}
            </button>
          </div>
        </div>

        {/* Service Type Increment Section */}
        <div className={styles.bulkUpdateSection}>
          <h2>Service Type Price Increments</h2>
          <div className={styles.incrementSection}>
            {serviceTypes.map(type => (
              <div key={type.key} className={styles.incrementRow}>
                <label>{type.label}:</label>
                <input
                  type="number"
                  placeholder="0"
                  value={serviceIncrements[type.key]}
                  onChange={e => setServiceIncrements(prev => ({ ...prev, [type.key]: parseFloat(e.target.value) || 0 }))}
                  className={styles.incrementInput}
                />
                <span>%</span>
                <button
                  onClick={() => handleServiceIncrementUpdate(type.key)}
                  disabled={incrementUpdating}
                  className={styles.incrementButton}
                >
                  {incrementUpdating ? 'Updating...' : 'Apply'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add/Edit Cab */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2>{editingCab ? 'Edit Cab' : 'Add New Cab'}</h2>
          <div className={styles.row}>
            <input type="text" placeholder="Car Name" value={form.Car} onChange={e => handleInputChange('Car', e.target.value)} required />
          </div>
          <ImageUpload onUploadSuccess={url => handleInputChange('Imgg', url)} currentImage={form.Imgg} label="Cab Image" />
          <div className={styles.row}>
            <input type="number" placeholder="Price" value={form.Price} onChange={e => handleInputChange('Price', e.target.value)} required />
            <input type="number" placeholder="Seats" value={form.Seats} onChange={e => handleInputChange('Seats', e.target.value)} required />
            <input type="number" placeholder="Luggage (kg)" value={form.Luggage} onChange={e => handleInputChange('Luggage', e.target.value)} required />
          </div>
          {/* Conditional fields based on service type */}
          {(serviceType === 'cars' || serviceType === 'roundtrips') && (
            <div className={styles.row}>
              <input type="text" placeholder="From Location" value={form.From} onChange={e => handleInputChange('From', e.target.value)} required />
              <input type="text" placeholder="To Location" value={form.To} onChange={e => handleInputChange('To', e.target.value)} required />
            </div>
          )}
          {serviceType === 'hourly' && (
            <div className={styles.row}>
              <input type="text" placeholder="City" value={form.City} onChange={e => handleInputChange('City', e.target.value)} required />
              <input type="number" placeholder="Hours" value={form.Hours} onChange={e => handleInputChange('Hours', e.target.value)} required />
            </div>
          )}
          <div className={styles.buttonRow}>
            <button type="submit">{editingCab ? 'Update Cab' : 'Add Cab'}</button>
            {editingCab && (
              <button
                type="button"
                onClick={() => {
                  setEditingCab(null);
                  setForm({
                    type: '',
                    subtype: '',
                    From: '',
                    To: '',
                    City: '',
                    Hours: '',
                    Car: '',
                    Imgg: '',
                    Price: '',
                    Seats: '',
                    Luggage: '',
                    incrementPercent: 0,
                    sbiLag: 0,
                  });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* All Cabs */}
        <div className={styles.cabsList}>
          <h2>
            All Cabs (showing {Math.min(currentPage * itemsPerPage, cabs.length)} of {cabs.length})
          </h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {cabs.slice(0, currentPage * itemsPerPage).map(cab => (
                <div key={cab._id} className={styles.cabCard}>
                  {cab.Imgg && <img src={cab.Imgg} alt={cab.Car} />}
                  <div>
                    <p>Car: {cab.Car}</p>
                    <p>Price: ₹{getAdjustedPrice(cab)}</p>
                    <div className={styles.cardActions}>
                      <button onClick={() => handleEdit(cab)}>Edit</button>
                      <button onClick={() => handleDelete(cab._id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
              {cabs.length > currentPage * itemsPerPage && (
                <div className={styles.loadMore}>
                  <button onClick={() => setCurrentPage(prev => prev + 1)}>See More</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AdminAuthWrapper>
  );
}
