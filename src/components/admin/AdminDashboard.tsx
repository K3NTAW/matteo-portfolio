"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  MessageSquare, 
  Image, 
  Video,
  Briefcase,
  Eye,
  User,
  FileText,
  LogOut,
  Settings
} from 'lucide-react';
import { 
  getExperiences, 
  createExperience, 
  updateExperience, 
  deleteExperience,
  getMedia,
  createMedia,
  deleteMedia,
  getContactMessages,
  markMessageAsRead,
  deleteContactMessage,
  uploadFile,
  getAdminProfile,
  createAdminProfile,
  updateAdminProfile,
  getAboutContent,
  createAboutContent,
  updateAboutContent,
  authenticateAdmin
} from '@/lib/database';
import { Experience, Media, ContactMessage, AdminProfile, AboutContent } from '@/types/database';
import { supabase } from '@/lib/supabase';

interface AdminDashboardProps {
  onLogout: () => void;
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'experiences' | 'media' | 'messages' | 'profile' | 'about' | 'settings'>('experiences');
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [media, setMedia] = useState<Media[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [aboutContent, setAboutContent] = useState<AboutContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Experience | Media | null>(null);

  // Form states
  const [experienceForm, setExperienceForm] = useState({
    title: '',
    description: '',
    project_number: ''
  });

  const [mediaForm, setMediaForm] = useState({
    title: '',
    description: '',
    file_type: 'image' as 'image' | 'video',
    file: null as File | null
  });

  const [profileForm, setProfileForm] = useState({
    name: '',
    position: '',
    slogan: '',
    profile_picture: null as File | null
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  const [aboutForm, setAboutForm] = useState({
    content: '',
    image: null as File | null
  });
  const [isEditingAbout, setIsEditingAbout] = useState(false);

  const [settingsForm, setSettingsForm] = useState({
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isEditingSettings, setIsEditingSettings] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [expData, mediaData, messagesData, profileData, aboutData] = await Promise.all([
        getExperiences(),
        getMedia(),
        getContactMessages(),
        getAdminProfile(),
        getAboutContent()
      ]);
      setExperiences(expData);
      setMedia(mediaData);
      setMessages(messagesData);
      setAdminProfile(profileData);
      setAboutContent(aboutData);
      
      // Pre-fill profile form if profile exists
      if (profileData) {
        setProfileForm({
          name: profileData.name,
          position: profileData.position,
          slogan: profileData.slogan,
          profile_picture: null
        });
      }

      // Pre-fill about form if content exists
      if (aboutData) {
        setAboutForm({
          content: aboutData.content,
          image: null
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExperienceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const experienceData = {
        ...experienceForm,
        project_number: parseInt(experienceForm.project_number) || 0
      };
      
      if (editingItem) {
        await updateExperience(editingItem.id, experienceData);
      } else {
        await createExperience(experienceData);
      }
      setShowForm(false);
      setEditingItem(null);
      setExperienceForm({ title: '', description: '', project_number: '' });
      loadData();
    } catch (error) {
      console.error('Error saving experience:', error);
    }
  };

  const handleMediaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaForm.file) return;

    try {
      const fileUrl = await uploadFile(mediaForm.file);
      await createMedia({
        title: mediaForm.title,
        description: mediaForm.description,
        file_url: fileUrl,
        file_type: mediaForm.file_type,
        file_size: mediaForm.file.size
      });
      setShowForm(false);
      setMediaForm({ title: '', description: '', file_type: 'image', file: null });
      loadData();
    } catch (error) {
      console.error('Error uploading media:', error);
    }
  };

  const handleDelete = async (type: 'experience' | 'media' | 'message', id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      switch (type) {
        case 'experience':
          await deleteExperience(id);
          break;
        case 'media':
          await deleteMedia(id);
          break;
        case 'message':
          await deleteContactMessage(id);
          break;
      }
      loadData();
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markMessageAsRead(id);
      loadData();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let profilePictureUrl = adminProfile?.profile_picture_url || '';
      
      if (profileForm.profile_picture) {
        profilePictureUrl = await uploadFile(profileForm.profile_picture, 'portfolio-media');
      }

      const profileData = {
        name: profileForm.name,
        position: profileForm.position,
        slogan: profileForm.slogan,
        profile_picture_url: profilePictureUrl
      };

      if (adminProfile) {
        await updateAdminProfile(adminProfile.id, profileData);
      } else {
        await createAdminProfile(profileData);
      }
      
      setIsEditingProfile(false);
      loadData();
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleAboutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imageUrl = aboutContent?.image_url || '';
      
      if (aboutForm.image) {
        imageUrl = await uploadFile(aboutForm.image, 'portfolio-media');
      }

      const aboutData = {
        content: aboutForm.content,
        image_url: imageUrl
      };

      if (aboutContent) {
        await updateAboutContent(aboutContent.id, aboutData);
      } else {
        await createAboutContent(aboutData);
      }
      
      setIsEditingAbout(false);
      loadData();
    } catch (error) {
      console.error('Error saving about content:', error);
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password confirmation
    if (settingsForm.newPassword !== settingsForm.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    // Validate current password
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) {
      alert('Session expired. Please login again.');
      onLogout();
      return;
    }

    try {
      const currentAdmin = JSON.parse(adminSession);
      
      // Verify current password
      const isValid = await authenticateAdmin(currentAdmin.email, settingsForm.currentPassword);
      if (!isValid) {
        alert('Current password is incorrect');
        return;
      }

      // Update admin credentials in database
      const { error } = await supabase
        .from('admins')
        .update({
          email: settingsForm.email,
          password_hash: settingsForm.newPassword
        })
        .eq('id', currentAdmin.id);

      if (error) throw error;

      // Update local session
      const updatedAdmin = { ...currentAdmin, email: settingsForm.email };
      localStorage.setItem('adminSession', JSON.stringify(updatedAdmin));

      alert('Settings updated successfully!');
      setIsEditingSettings(false);
      setSettingsForm({
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-layout min-h-screen bg-black text-white p-8 relative z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-[#E0F21E]">Admin Dashboard</h1>
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('experiences')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              activeTab === 'experiences' 
                ? 'bg-[#E0F21E] text-black' 
                : 'bg-gray-800 text-white'
            }`}
          >
            <Briefcase size={20} />
            Experiences
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              activeTab === 'media' 
                ? 'bg-[#E0F21E] text-black' 
                : 'bg-gray-800 text-white'
            }`}
          >
            <Image size={20} />
            Media
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              activeTab === 'messages' 
                ? 'bg-[#E0F21E] text-black' 
                : 'bg-gray-800 text-white'
            }`}
          >
            <MessageSquare size={20} />
            Messages ({messages.filter(m => !m.read).length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              activeTab === 'profile' 
                ? 'bg-[#E0F21E] text-black' 
                : 'bg-gray-800 text-white'
            }`}
          >
            <User size={20} />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              activeTab === 'about' 
                ? 'bg-[#E0F21E] text-black' 
                : 'bg-gray-800 text-white'
            }`}
          >
            <FileText size={20} />
            About
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              activeTab === 'settings' 
                ? 'bg-[#E0F21E] text-black' 
                : 'bg-gray-800 text-white'
            }`}
          >
            <Settings size={20} />
            Settings
          </button>
        </div>

        {/* Content */}
        <div className="bg-gray-900 rounded-lg p-6">
          {activeTab === 'experiences' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Experiences</h2>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-[#E0F21E] text-black px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus size={20} />
                  Add Experience
                </button>
              </div>

              {showForm && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 p-6 rounded-lg mb-6"
                >
                  <h3 className="text-xl font-bold mb-4">
                    {editingItem ? 'Edit Experience' : 'Add New Experience'}
                  </h3>
                  <form onSubmit={handleExperienceSubmit} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Title"
                      value={experienceForm.title}
                      onChange={(e) => setExperienceForm({ ...experienceForm, title: e.target.value })}
                      className="w-full p-3 bg-gray-700 rounded-lg text-white"
                      required
                    />
                    <textarea
                      placeholder="Description"
                      value={experienceForm.description}
                      onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                      className="w-full p-3 bg-gray-700 rounded-lg text-white h-32"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Project Number"
                      value={experienceForm.project_number}
                      onChange={(e) => setExperienceForm({ ...experienceForm, project_number: e.target.value })}
                      className="w-full p-3 bg-gray-700 rounded-lg text-white"
                      required
                    />
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="bg-[#E0F21E] text-black px-6 py-2 rounded-lg"
                      >
                        {editingItem ? 'Update' : 'Create'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setEditingItem(null);
                          setExperienceForm({ title: '', description: '', project_number: '' });
                        }}
                        className="bg-gray-600 text-white px-6 py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="bg-gray-800 p-4 rounded-lg flex justify-between items-center">
                    <div>
                      <h3 className="font-bold">{exp.title}</h3>
                      <p className="text-gray-300 text-sm">Project {exp.project_number}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingItem(exp);
                          setExperienceForm({
                            title: exp.title,
                            description: exp.description,
                            project_number: exp.project_number.toString()
                          });
                          setShowForm(true);
                        }}
                        className="bg-blue-600 p-2 rounded-lg"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete('experience', exp.id)}
                        className="bg-red-600 p-2 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Media</h2>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-[#E0F21E] text-black px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Upload size={20} />
                  Upload Media
                </button>
              </div>

              {showForm && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800 p-6 rounded-lg mb-6"
                >
                  <h3 className="text-xl font-bold mb-4">Upload New Media</h3>
                  <form onSubmit={handleMediaSubmit} className="space-y-4">
                    <input
                      type="text"
                      placeholder="Title"
                      value={mediaForm.title}
                      onChange={(e) => setMediaForm({ ...mediaForm, title: e.target.value })}
                      className="w-full p-3 bg-gray-700 rounded-lg text-white"
                      required
                    />
                    <textarea
                      placeholder="Description"
                      value={mediaForm.description}
                      onChange={(e) => setMediaForm({ ...mediaForm, description: e.target.value })}
                      className="w-full p-3 bg-gray-700 rounded-lg text-white h-32"
                    />
                    <select
                      value={mediaForm.file_type}
                      onChange={(e) => setMediaForm({ ...mediaForm, file_type: e.target.value as 'image' | 'video' })}
                      className="w-full p-3 bg-gray-700 rounded-lg text-white"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                    <input
                      type="file"
                      onChange={(e) => setMediaForm({ ...mediaForm, file: e.target.files?.[0] || null })}
                      className="w-full p-3 bg-gray-700 rounded-lg text-white"
                      accept={mediaForm.file_type === 'image' ? 'image/*' : 'video/*'}
                      required
                    />
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="bg-[#E0F21E] text-black px-6 py-2 rounded-lg"
                      >
                        Upload
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForm(false);
                          setMediaForm({ title: '', description: '', file_type: 'image', file: null });
                        }}
                        className="bg-gray-600 text-white px-6 py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {media.map((item) => (
                  <div key={item.id} className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        {item.file_type === 'image' ? <Image size={16} /> : <Video size={16} />}
                        <span className="text-sm text-gray-300">{item.file_type}</span>
                      </div>
                      <button
                        onClick={() => handleDelete('media', item.id)}
                        className="bg-red-600 p-1 rounded"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <h3 className="font-bold mb-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-gray-300 text-sm mb-2">{item.description}</p>
                    )}
                    <a
                      href={item.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#E0F21E] text-sm hover:underline"
                    >
                      View File
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Messages</h2>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`bg-gray-800 p-4 rounded-lg ${!message.read ? 'border-l-4 border-[#E0F21E]' : ''}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold">{message.name}</h3>
                        <p className="text-gray-300 text-sm">{message.email}</p>
                        {message.company && (
                          <p className="text-gray-300 text-sm">{message.company}</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {!message.read && (
                          <button
                            onClick={() => handleMarkAsRead(message.id)}
                            className="bg-green-600 p-2 rounded-lg"
                            title="Mark as read"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete('message', message.id)}
                          className="bg-red-600 p-2 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-2">{message.message}</p>
                    <p className="text-gray-500 text-xs">
                      {new Date(message.created_at).toLocaleString()}
                      {!message.read && <span className="ml-2 text-[#E0F21E]">• Unread</span>}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Admin Profile</h2>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="bg-[#E0F21E] text-black px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Edit size={20} />
                  {isEditingProfile ? 'Save Changes' : 'Edit Profile'}
                </button>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg">
                {isEditingProfile ? (
                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="flex items-center gap-6 mb-6">
                                          <img
                      src={adminProfile?.profile_picture_url || '/placeholder-avatar.png'}
                      alt="Admin Profile"
                      className="w-24 h-24 rounded-full object-cover"
                    />
                      <div className="flex-1">
                        <input
                          type="file"
                          onChange={(e) => setProfileForm({ ...profileForm, profile_picture: e.target.files?.[0] || null })}
                          className="w-full p-3 bg-gray-700 rounded-lg text-white"
                          accept="image/*"
                        />
                      </div>
                    </div>
                    
                    <input
                      type="text"
                      placeholder="Name"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full p-3 bg-gray-700 rounded-lg text-white"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Position"
                      value={profileForm.position}
                      onChange={(e) => setProfileForm({ ...profileForm, position: e.target.value })}
                      className="w-full p-3 bg-gray-700 rounded-lg text-white"
                      required
                    />
                    <textarea
                      placeholder="Slogan"
                      value={profileForm.slogan}
                      onChange={(e) => setProfileForm({ ...profileForm, slogan: e.target.value })}
                      className="w-full p-3 bg-gray-700 rounded-lg text-white h-20"
                      required
                    />
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="bg-[#E0F21E] text-black px-6 py-2 rounded-lg"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingProfile(false);
                          // Reset form to current profile data
                          if (adminProfile) {
                            setProfileForm({
                              name: adminProfile.name,
                              position: adminProfile.position,
                              slogan: adminProfile.slogan,
                              profile_picture: null
                            });
                          }
                        }}
                        className="bg-gray-600 text-white px-6 py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center gap-6">
                    <img
                      src={adminProfile?.profile_picture_url || '/placeholder-avatar.png'}
                      alt={adminProfile?.name || 'Admin Profile'}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{adminProfile?.name || 'No name set'}</h3>
                      <p className="text-gray-300 text-lg mb-2">{adminProfile?.position || 'No position set'}</p>
                      <p className="text-gray-400 italic">&ldquo;{adminProfile?.slogan || 'No slogan set'}&rdquo;</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">About Page Content</h2>
                <button
                  onClick={() => setIsEditingAbout(!isEditingAbout)}
                  className="bg-[#E0F21E] text-black px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Edit size={20} />
                  {isEditingAbout ? 'Save Changes' : 'Edit Content'}
                </button>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg">
                {isEditingAbout ? (
                  <form onSubmit={handleAboutSubmit} className="space-y-4">
                    <textarea
                      placeholder="Content (supports line breaks)"
                      value={aboutForm.content}
                      onChange={(e) => setAboutForm({ ...aboutForm, content: e.target.value })}
                      className="w-full p-3 bg-gray-700 rounded-lg text-white h-40"
                      required
                    />
                    <input
                      type="file"
                      onChange={(e) => setAboutForm({ ...aboutForm, image: e.target.files?.[0] || null })}
                      className="w-full p-3 bg-gray-700 rounded-lg text-white"
                      accept="image/*"
                    />
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="bg-[#E0F21E] text-black px-6 py-2 rounded-lg"
                      >
                        Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingAbout(false);
                          // Reset form to current content
                          if (aboutContent) {
                            setAboutForm({
                              content: aboutContent.content,
                              image: null
                            });
                          }
                        }}
                        className="bg-gray-600 text-white px-6 py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <div className="text-gray-300 leading-relaxed">
                        {aboutContent?.content ? (
                          <div dangerouslySetInnerHTML={{ __html: aboutContent.content.replace(/\n/g, '<br />') }} />
                        ) : (
                          <p>No content set</p>
                        )}
                      </div>
                    </div>
                    <div className="lg:col-span-1">
                      {aboutContent?.image_url ? (
                        <img
                          src={aboutContent.image_url}
                          alt="About page image"
                          className="w-full h-auto rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-700 rounded-lg flex items-center justify-center">
                          <p className="text-gray-500">No image uploaded</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Account Settings</h2>
                <button
                  onClick={() => setIsEditingSettings(!isEditingSettings)}
                  className="bg-[#E0F21E] text-black px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Edit size={20} />
                  {isEditingSettings ? 'Save Changes' : 'Edit Settings'}
                </button>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg">
                {isEditingSettings ? (
                  <form onSubmit={handleSettingsSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        New Email
                      </label>
                      <input
                        type="email"
                        placeholder="Enter new email"
                        value={settingsForm.email}
                        onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                        className="w-full p-3 bg-gray-700 rounded-lg text-white"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter current password"
                        value={settingsForm.currentPassword}
                        onChange={(e) => setSettingsForm({ ...settingsForm, currentPassword: e.target.value })}
                        className="w-full p-3 bg-gray-700 rounded-lg text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Enter new password"
                        value={settingsForm.newPassword}
                        onChange={(e) => setSettingsForm({ ...settingsForm, newPassword: e.target.value })}
                        className="w-full p-3 bg-gray-700 rounded-lg text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        placeholder="Confirm new password"
                        value={settingsForm.confirmPassword}
                        onChange={(e) => setSettingsForm({ ...settingsForm, confirmPassword: e.target.value })}
                        className="w-full p-3 bg-gray-700 rounded-lg text-white"
                        required
                      />
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="bg-[#E0F21E] text-black px-6 py-2 rounded-lg"
                      >
                        Update Settings
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingSettings(false);
                          setSettingsForm({
                            email: '',
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                          });
                        }}
                        className="bg-gray-600 text-white px-6 py-2 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Current Email</h3>
                      <p className="text-gray-300">
                        {(() => {
                          const adminSession = localStorage.getItem('adminSession');
                          if (adminSession) {
                            const admin = JSON.parse(adminSession);
                            return admin.email;
                          }
                          return 'Not available';
                        })()}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Password</h3>
                      <p className="text-gray-300">••••••••</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 