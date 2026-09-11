import mongoose from 'mongoose';
import { User } from './models/User.js';
import { Batch } from './models/Batch.js';
import { Course } from './models/Course.js';
import { config } from './config/env.js';

const seedDatabase = async () => {
  try {
    console.log('[Seeder]: Connecting to MongoDB...');
    await mongoose.connect(config.mongoUri);

    // Clear existing test data
    await User.deleteMany({ email: { $in: ['admin@edubatch.com', 'teacher@edubatch.com', 'student@edubatch.com'] } });

    console.log('[Seeder]: Creating Admin account...');
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@edubatch.com',
      password: 'AdminPassword123!',
      role: 'admin',
      phone: '+919900011122',
      avatar: '/admin.png',
    });

    console.log('[Seeder]: Creating Teacher account...');
    const teacher = await User.create({
      name: 'Prof. Alok Verma',
      email: 'teacher@edubatch.com',
      password: 'TeacherPassword123!',
      role: 'teacher',
      phone: '+919876500112',
      avatar: '/teacher.png',
    });

    console.log('[Seeder]: Creating Student account...');
    const student = await User.create({
      name: 'Rahul Sharma',
      email: 'student@edubatch.com',
      password: 'StudentPassword123!',
      role: 'student',
      phone: '+919876543210',
      avatar: '/student.png',
    });

    // Create a default batch assigned to teacher
    await Batch.deleteMany({ name: 'JEE 2027 Morning Rank Booster' });
    const batch = await Batch.create({
      name: 'JEE 2027 Morning Rank Booster',
      subject: 'Physics & Mathematics',
      description: 'Intensive morning batch for JEE aspirants with weekly DPPs and mock tests.',
      startDate: new Date(),
      endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      schedule: {
        days: ['Mon', 'Wed', 'Fri'],
        startTime: '07:00 AM',
        endTime: '09:30 AM',
      },
      capacity: 40,
      fee: 14999,
      teacher: teacher._id,
      status: 'active',
      createdBy: admin._id,
    });

    // Create Popular Courses for catalog
    await Course.deleteMany({});
    const courses = await Course.create([
      {
        title: 'JEE Main & Advanced Physics Rank Booster Batch',
        category: 'JEE & NEET Prep',
        instructor: 'Prof. Alok Verma (Ex-IITian)',
        rating: 4.9,
        price: 149,
        oldPrice: 299,
        duration: '120 Hours',
        level: 'Class 11 & 12',
        image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?auto=format&fit=crop&q=80&w=600',
        description: 'Comprehensive batch covering Mechanics, Electrodynamics, Optics, and Modern Physics with PYQ problem solving.'
      },
      {
        title: 'NEET Biology & Organic Chemistry Intensive Batch',
        category: 'JEE & NEET Prep',
        instructor: 'Dr. Sunita Rao',
        rating: 4.8,
        price: 129,
        oldPrice: 249,
        duration: '110 Hours',
        level: 'Target 2026',
        image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600',
        description: 'NCERT line-by-line breakdown, Botany, Zoology & Organic reaction mechanisms with weekly DPPs & All-India Mocks.'
      },
      {
        title: 'Class 12 CBSE & State Board Maths Crash Course',
        category: 'Board Exams',
        instructor: 'Ramanathan Iyer',
        rating: 4.7,
        price: 79,
        oldPrice: 149,
        duration: '60 Hours',
        level: 'Class 12 Board',
        image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=600',
        description: 'Calculus, Vectors, 3D Geometry & Probability with board paper presentation strategies & sample paper solving.'
      },
      {
        title: 'Full-Stack Web Development Bootcamp (MERN)',
        category: 'Coding Bootcamps',
        instructor: 'Ananya Sen',
        rating: 4.9,
        price: 199,
        oldPrice: 399,
        duration: '160 Hours',
        level: 'Career Bootcamp',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600',
        description: 'Production-ready MERN stack web app building, Git workflows, REST APIs, deployment & portfolio projects.'
      },
      {
        title: 'Spoken English & Business Communication Intensive',
        category: 'Language Institutes',
        instructor: 'Sarah Jenkins',
        rating: 4.9,
        price: 59,
        oldPrice: 119,
        duration: '40 Hours',
        level: 'All Levels',
        image: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=600',
        description: 'Fluency practice, accent neutralization, corporate email writing, mock interviews, and group discussions.'
      },
      {
        title: 'Class 8-10 Science & Math Foundation Olympiad Batch',
        category: 'School Foundation',
        instructor: 'Meera Deshmukh',
        rating: 4.9,
        price: 89,
        oldPrice: 159,
        duration: '75 Hours',
        level: 'Class 8, 9 & 10',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
        description: 'Early competitive foundation for NSTSE, NSO, IMO, and early conceptual base building for future entrance exams.'
      }
    ]);

    console.log('\n==================================================');
    console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY');
    console.log('==================================================');
    console.log('👑 ADMIN ACCESS:');
    console.log('   Email:    admin@edubatch.com');
    console.log('   Password: AdminPassword123!');
    console.log('   ID:      ', admin._id.toString());
    console.log('\n👨‍🏫 TEACHER ACCESS:');
    console.log('   Email:    teacher@edubatch.com');
    console.log('   Password: TeacherPassword123!');
    console.log('   ID:      ', teacher._id.toString());
    console.log('\n🎓 STUDENT ACCESS:');
    console.log('   Email:    student@edubatch.com');
    console.log('   Password: StudentPassword123!');
    console.log('   ID:      ', student._id.toString());
    console.log('\n📚 COURSES CREATED:', courses.length);
    console.log('==================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('[Seeder Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
