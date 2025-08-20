@@ .. @@
         {/* Spotify Player */}
         <motion.div
           initial={{ scale: 0.9, opacity: 0 }}
           animate={{ scale: 1, opacity: 1 }}
           transition={{ delay: 0.7 }}
+          className="lg:col-span-2"
         >
           <MusicPlayer />
         </motion.div>