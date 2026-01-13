import React from 'react';
import { Course } from '../../types';
import { getImageUrl, formatCurrency } from '../../shared/utils';
import './CourseCard.css';

interface CourseCardProps {
  course: Course;
  onAction?: (course: Course) => void;
  actionLabel?: string;
  showStatus?: boolean;
  disabled?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onAction,
  actionLabel,
  showStatus = false,
  disabled = false,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      case 'pending': return '#ffc107';
      default: return '#6c757d';
    }
  };

  return (
    <div className="course-card">
      <img src={getImageUrl(course.imageUrl)} alt={course.courseName} />
      <div className="course-info">
        <h3>{course.courseName}</h3>
        <p className="instructor">By: {course.instructorId.name}</p>
        <p className="price">{formatCurrency(course.price)}</p>
        
        {showStatus && (
          <p 
            className="status"
            style={{ color: getStatusColor(course.status) }}
          >
            Status: {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
          </p>
        )}
        
        {onAction && actionLabel && (
          <button 
            onClick={() => onAction(course)}
            className="action-btn"
            disabled={disabled}
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;