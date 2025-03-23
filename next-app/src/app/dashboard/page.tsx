<<<<<<< HEAD
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import AddCourseModal from '@/components/AddCourseModal';
import { CourseCard } from '@/components/CourseCard';
import Navbar from '@/components/Navbar';
import { authFetch } from '@/lib/utils/auth-fetch';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Course {
  _id: string;
  courseName: string;
  courseDescription: string;
  profName: string;
  times: string[];
  createdAt: string;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Check for 'added' param to show toast
  useEffect(() => {
    const added = searchParams.get('added');
    if (added === 'true') {
      toast({
        title: 'Course Added Successfully!',
        description: 'Your course has been added to your dashboard.',
      });
    }
  }, [searchParams, toast]);

  // Fetch courses when user is authenticated
  const fetchCourses = async () => {
    if (user) {
      try {
        setIsLoading(true);
        const response = await authFetch('/api/courses');
        
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        
        const data = await response.json();
        console.log("Courses data from API:", data); // Log the response to inspect format
        if (Array.isArray(data.courses)) {
          setCourses(data.courses);
        } else {
          setCourses([]);
          setError('Invalid response format from API');
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('An error occurred while fetching your courses');
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (user) {
      fetchCourses();
    }
  }, [user]);

  const handleAddCourse = async (formData: any) => {
    try {
      // Validate times array to ensure it's properly formatted
      if (formData.times && Array.isArray(formData.times)) {
        // Ensure all time entries are strings
        formData.times = formData.times.filter((time: any) => time && typeof time === 'string');
      } else {
        formData.times = [];
      }

      const response = await authFetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsAddCourseModalOpen(false);
        toast({
          title: 'Success!',
          description: 'Course has been added successfully',
        });
        fetchCourses(); // Refresh the courses list
      } else {
        const errorData = await response.json();
        toast({
          title: 'Error',
          description: errorData.error || 'Failed to add course',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error adding course:', error);
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleCourseClick = (courseId: string) => {
    router.push(`/course/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Courses</h1>
          <Button onClick={() => setIsAddCourseModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Course
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        ) : error ? (
          <div className="p-4 mb-6 bg-red-100 border border-red-300 text-red-700 rounded">
            {error}
            <button 
              className="ml-2 underline"
              onClick={fetchCourses}
            >
              Retry
            </button>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">You don't have any courses yet.</p>
            <Button onClick={() => setIsAddCourseModalOpen(true)} className="mt-4">
              <Plus className="mr-2 h-4 w-4" /> Add Your First Course
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                course={{
                  id: course._id,
                  name: course.courseName,
                  description: course.courseDescription,
                  profName: course.profName,
                  times: Array.isArray(course.times) ? course.times : [],
                  createdAt: course.createdAt
                }}
                onClick={() => handleCourseClick(course._id)}
              />
            ))}
          </div>
        )}

        <AddCourseModal
          isOpen={isAddCourseModalOpen}
          onClose={() => setIsAddCourseModalOpen(false)}
          onAddCourse={handleAddCourse}
        />
      </main>
    </div>
  );
} 
=======
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import AddCourseModal from '@/components/AddCourseModal';
import CourseCard from '@/components/CourseCard';
import Navbar from '@/components/Navbar';

interface Course {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

const Dashboard = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      // Placeholder for API call to fetch courses
      // This would be replaced with actual API call in a real app
      setTimeout(() => {
        setCourses([
          {
            id: '1',
            name: 'Introduction to React',
            description: 'Learn the fundamentals of React including components, state, and props.',
            createdAt: new Date().toISOString(),
          },
          {
            id: '2',
            name: 'Advanced JavaScript Concepts',
            description: 'Explore closures, prototypes, and asynchronous programming in JavaScript.',
            createdAt: new Date().toISOString(),
          },
        ]);
        setIsLoading(false);
      }, 1000);
    }
  }, [user]);

  const handleAddCourse = (course: Omit<Course, 'id' | 'createdAt'>) => {
    // Placeholder for API call to add a course
    // This would be replaced with actual API call in a real app
    const newCourse = {
      ...course,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setCourses([...courses, newCourse]);
    setIsAddCourseModalOpen(false);
  };

  const handleCourseClick = (courseId: string) => {
    router.push(`/dashboard/course/${courseId}`);
  };

  if (loading || !user) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Courses</h1>
          <button
            onClick={() => setIsAddCourseModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Course
          </button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-600">You don't have any courses yet.</p>
            <button
              onClick={() => setIsAddCourseModalOpen(true)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Create your first course
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => handleCourseClick(course.id)}
              />
            ))}
          </div>
        )}
      </main>

      <AddCourseModal
        isOpen={isAddCourseModalOpen}
        onClose={() => setIsAddCourseModalOpen(false)}
        onAddCourse={handleAddCourse}
      />
    </div>
  );
};

export default Dashboard; 
>>>>>>> ddf2cd83b60d633298316a12ea312fd47865171c
