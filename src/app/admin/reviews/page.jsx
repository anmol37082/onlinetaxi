"use client";

import React, { useState, useEffect } from "react";
import styles from "./AdminReviews.module.css";
import AdminAuthWrapper from "../../components/AdminAuthWrapper";

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    rating: 5,
    text: "",
    tourType: "",
    tourDescription: ""
  });

  const fetchReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      if (!res.ok) throw new Error("Failed to fetch reviews");
      const data = await res.json();
      setReviews(data.reviews || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingReview ? "PUT" : "POST";
      const body = editingReview ? { ...formData, id: editingReview._id } : formData;

      const res = await fetch("/api/reviews", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      if (!res.ok) throw new Error("Failed to save review");

      fetchReviews();
      setFormData({
        name: "",
        role: "",
        rating: 5,
        text: "",
        tourType: "",
        tourDescription: ""
      });
      setEditingReview(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({
      name: review.name,
      role: review.role,
      rating: review.rating,
      text: review.text,
      tourType: review.tourType,
      tourDescription: review.tourDescription
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`/api/reviews?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete review");
      fetchReviews();
    } catch (err) {
      setError(err.message);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? '#ffb938' : '#ddd' }}>
        ★
      </span>
    ));
  };

  if (loading) {
    return (
      <AdminAuthWrapper>
        <div className={styles.container}>
          <div className={styles.heroBgPattern}></div>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>Loading reviews...</p>
          </div>
        </div>
      </AdminAuthWrapper>
    );
  }

  if (error) {
    return (
      <AdminAuthWrapper>
        <div className={styles.container}>
          <div className={styles.heroBgPattern}></div>
          <div className={styles.error}>
            <h3>Error Loading Reviews</h3>
            <p>{error}</p>
            <button onClick={fetchReviews} className={styles.submitButton}>
              Try Again
            </button>
          </div>
        </div>
      </AdminAuthWrapper>
    );
  }

  return (
    <AdminAuthWrapper>
      <div className={styles.container}>
        <div className={styles.heroBgPattern}></div>

        {/* Header Section */}
        <div className={styles.header}>
          <div className={styles.headerTop}>
            <a href="/admin" className={styles.backButton}>
              <i className="fas fa-arrow-left"></i>
              Back to Admin Panel
            </a>
          </div>
          <h1 className={styles.title}>Reviews Management</h1>
          <p className={styles.subtitle}>Manage customer reviews and testimonials</p>
        </div>

        {/* Stats Section */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div style={{ fontSize: '2rem', color: '#ffb938' }}>⭐</div>
            <div>
              <h3 className={styles.statNumber}>{reviews.length}</h3>
              <p className={styles.statLabel}>Total Reviews</p>
            </div>
          </div>
          <div className={styles.statCard}>
            <div style={{ fontSize: '2rem', color: '#ffb938' }}>📊</div>
            <div>
              <h3 className={styles.statNumber}>
                {(reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length || 0).toFixed(1)}
              </h3>
              <p className={styles.statLabel}>Average Rating</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className={styles.formSection}>
          <h2 className={styles.formTitle}>
            <span style={{ color: '#ffb938' }}>✏️</span>
            {editingReview ? 'Edit Review' : 'Add New Review'}
          </h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Customer Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Role/Position"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <select
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                className={styles.input}
                required
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                <option value={3}>⭐⭐⭐ (3 Stars)</option>
                <option value={2}>⭐⭐ (2 Stars)</option>
                <option value={1}>⭐ (1 Star)</option>
              </select>
            </div>

            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
              <textarea
                placeholder="Review Text"
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                className={`${styles.input} ${styles.textarea}`}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Tour Type"
                value={formData.tourType}
                onChange={(e) => setFormData({ ...formData, tourType: e.target.value })}
                className={styles.input}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <input
                type="text"
                placeholder="Tour Description"
                value={formData.tourDescription}
                onChange={(e) => setFormData({ ...formData, tourDescription: e.target.value })}
                className={styles.input}
                required
              />
            </div>

            <button type="submit" className={styles.submitButton}>
              <span style={{ color: 'white' }}>💾</span>
              {editingReview ? "Update Review" : "Add Review"}
            </button>
          </form>
        </div>

        {/* Reviews Table */}
        <div className={styles.reviewsSection}>
          <h2 className={styles.sectionTitle}>
            <span>📋</span>
            All Reviews ({reviews.length})
          </h2>

          {reviews.length === 0 ? (
            <div className={styles.empty}>
              <div style={{ fontSize: '4rem', color: '#ffb938', opacity: 0.6 }}>⭐</div>
              <h3>No reviews found</h3>
              <p>Add your first review using the form above.</p>
            </div>
          ) : (
            <>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead className={styles.tableHeader}>
                    <tr>
                      <th>Name</th>
                      <th>Role</th>
                      <th>Rating</th>
                      <th>Review Text</th>
                      <th>Tour Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map((review) => (
                      <tr key={review._id} className={styles.tableRow}>
                        <td className={styles.tableCell}>
                          <strong>{review.name}</strong>
                        </td>
                        <td className={styles.tableCell}>{review.role}</td>
                        <td className={styles.tableCell}>
                          <div className={styles.rating}>
                            {renderStars(review.rating)}
                          </div>
                        </td>
                        <td className={styles.tableCell}>
                          <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {review.text}
                          </div>
                        </td>
                        <td className={styles.tableCell}>{review.tourType}</td>
                        <td className={styles.tableCell}>
                          <div className={styles.actions}>
                            <button
                              className={styles.editButton}
                              onClick={() => handleEdit(review)}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              className={styles.deleteButton}
                              onClick={() => handleDelete(review._id)}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className={styles.scrollIndicator}>
                ← Swipe to see more →
              </div>
            </>
          )}
        </div>
      </div>
    </AdminAuthWrapper>
  );
};

export default AdminReviewsPage;