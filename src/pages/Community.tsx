import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Heart, Share2, Users, Send, Plus } from 'lucide-react';

interface Post {
  id: number;
  author: string;
  field: string;
  content: string;
  likes: number;
  comments: number;
  liked: boolean;
}

export function Community() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: "Sarah Chen",
      field: "Engineering",
      content: "Just discovered a great technique for memorizing complex formulas! Using mind mapping has really helped me connect different concepts. Anyone else tried this?",
      likes: 24,
      comments: 8,
      liked: false
    },
    {
      id: 2,
      author: "Alex Kumar",
      field: "Arts",
      content: "Looking for study buddies for literature analysis! It's always better to discuss themes and interpretations together.",
      likes: 15,
      comments: 5,
      liked: true
    },
    {
      id: 3,
      author: "Maya Patel",
      field: "Medical",
      content: "Anatomy study tip: Use mnemonics for bone names! 'Some Lovers Try Positions That They Can't Handle' for carpal bones 😄",
      likes: 32,
      comments: 12,
      liked: false
    }
  ]);

  const [newPost, setNewPost] = useState('');

  const toggleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            liked: !post.liked, 
            likes: post.liked ? post.likes - 1 : post.likes + 1 
          }
        : post
    ));
  };

  const addPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPost.trim()) {
      const post: Post = {
        id: Date.now(),
        author: "You",
        field: "Student",
        content: newPost,
        likes: 0,
        comments: 0,
        liked: false
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 overflow-y-auto">
      <div className="p-4 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center mb-2">
            <Users className="text-pink-300 mr-2" size={24} />
            <h1 className="text-2xl font-bold text-white">Community</h1>
          </div>
          <p className="text-white/80 text-sm">Connect with fellow students</p>
        </motion.div>

        {/* New Post */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/20 backdrop-blur-lg rounded-2xl p-4 mb-6"
        >
          <form onSubmit={addPost} className="space-y-3">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share your study tips, ask questions, or motivate others..."
              className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm rounded-xl text-white placeholder-white/60 border border-white/30 focus:border-white/60 focus:outline-none resize-none h-20"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-medium transition-colors flex items-center"
              >
                <Send size={16} className="mr-1" />
                Post
              </button>
            </div>
          </form>
        </motion.div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/20 backdrop-blur-lg rounded-2xl p-4"
            >
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {post.author[0]}
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-white text-sm">{post.author}</h3>
                  <p className="text-white/60 text-xs">{post.field} Student</p>
                </div>
              </div>
              
              <p className="text-white text-sm mb-4 leading-relaxed">{post.content}</p>
              
              <div className="flex items-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center space-x-1 transition-colors ${
                    post.liked ? 'text-red-400' : 'text-white/60 hover:text-red-400'
                  }`}
                >
                  <Heart size={16} fill={post.liked ? 'currentColor' : 'none'} />
                  <span className="text-sm">{post.likes}</span>
                </motion.button>
                
                <button className="flex items-center space-x-1 text-white/60 hover:text-blue-400 transition-colors">
                  <MessageSquare size={16} />
                  <span className="text-sm">{post.comments}</span>
                </button>
                
                <button className="flex items-center space-x-1 text-white/60 hover:text-green-400 transition-colors">
                  <Share2 size={16} />
                  <span className="text-sm">Share</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}