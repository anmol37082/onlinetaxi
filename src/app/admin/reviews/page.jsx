"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";

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

  if (loading) return <div className={styles.loading}>Loading reviews...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Admin Reviews Management</h1>
        <button
          className={styles.addBtn}
          onClick={() => setEditingReview(null)}
        >
          Add New Review
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Rating (1-5)"
            min="1"
            max="5"
            value={formData.rating}
            onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
            required
          />
        </div>
        <textarea
          placeholder="Review Text"
          value={formData.text}
          onChange={(e) => setFormData({ ...formData, text: e.target.value })}
          required
          style={{ width: "100%", minHeight: "100px", marginBottom: "1rem" }}
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Tour Type"
            value={formData.tourType}
            onChange={(e) => setFormData({ ...formData, tourType: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Tour Description"
            value={formData.tourDescription}
            onChange={(e) => setFormData({ ...formData, tourDescription: e.target.value })}
            required
          />
        </div>
        <button type="submit" className={styles.addBtn}>
          {editingReview ? "Update Review" : "Add Review"}
        </button>
      </form>

      {reviews.length === 0 ? (
        <div className={styles.empty}>No reviews found.</div>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Rating</th>
              <th>Text</th>
              <th>Tour Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review._id}>
                <td>{review.name}</td>
                <td>{review.role}</td>
                <td>{review.rating}</td>
                <td>{review.text.substring(0, 50)}...</td>
                <td>{review.tourType}</td>
                <td className={styles.actions}>
                  <button
                    className={styles.editBtn}
                    onClick={() => handleEdit(review)}
                  >
                    Edit
                  </button>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(review._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminReviewsPage;
