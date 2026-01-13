import { useState, useEffect } from 'react';
import { Course } from '../types';
import { adminAPI, instructorAPI, studentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const useCourses = (searchTerm: string = '') => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        let response;
        
        switch (user?.role) {
          case 'admin':
            response = await adminAPI.getAllCourses(searchTerm);
            break;
          case 'instructor':
            response = await instructorAPI.getAllCourses(searchTerm);
            break;
          case 'student':
            response = await studentAPI.getCourses(searchTerm);
            break;
          default:
            throw new Error('Invalid user role');
        }
        
        setCourses(response.data.courses);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCourses();
    }
  }, [user, searchTerm]);

  return { courses, loading, error, refetch: () => fetchCourses() };
};

export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};