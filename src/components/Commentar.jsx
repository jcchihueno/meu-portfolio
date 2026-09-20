import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { getDocs, addDoc, collection, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase-comment';
import { MessageCircle, UserCircle2, Loader2, AlertCircle, Send, ImagePlus, X } from 'lucide-react';
import AOS from "aos";
import "aos/dist/aos.css";

const Comment = memo(({ comment, formatDate, index }) => (
    <div 
        className="px-4 pt-4 pb-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group hover:shadow-lg hover:-translate-y-0.5"
        
    >
        <div className="flex items-start gap-3 ">
            {comment.profileImage ? (
                <img
                    src={comment.profileImage}
                    alt={`${comment.userName}'s profile`}
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/30"
                    loading="lazy"
                />
            ) : (
                <div className="p-2 rounded-full bg-blue-500/20 text-blue-400 group-hover:bg-blue-500/30 transition-colors">
                    <UserCircle2 className="w-5 h-5" />
                </div>
            )}
            <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between gap-4 mb-2">
                    <h4 className="font-medium text-white truncate">{comment.userName}</h4>
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatDate(comment.createdAt)}
                    </span>
                </div>
                <p className="text-gray-300 text-sm break-words leading-relaxed relative bottom-2">{comment.content}</p>
            </div>
        </div>
    </div>
));

const CommentForm = memo(({ onSubmit, isSubmitting, error }) => {
    const [newComment, setNewComment] = useState('');
    const [userName, setUserName] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleImageChange = useCallback((e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) return;
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    }, []);

    const handleTextareaChange = useCallback((e) => {
        setNewComment(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, []);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (!newComment.trim() || !userName.trim()) return;
        
        onSubmit({ newComment, userName, imageFile });
        setNewComment('');
        setImagePreview(null);
        setImageFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }, [newComment, userName, imageFile, onSubmit]);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1000">
                <label className="block text-sm font-medium text-white">
                    Nome <span className="text-red-400">*</span>
                </label>
                <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Digite seu nome"
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                />
            </div>

            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1200">
                <label className="block text-sm font-medium text-white">
                    Mensagem <span className="text-red-400">*</span>
                </label>
                <textarea
                    ref={textareaRef}
                    value={newComment}
                    onChange={handleTextareaChange}
                    placeholder="Escreva sua mensagem aqui..."
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all resize-none min-h-[120px]"
                    required
                />
            </div>

            <div className="space-y-2" data-aos="fade-up" data-aos-duration="1400">
                <label className="block text-sm font-medium text-white">
                    Foto de Perfil <span className="text-gray-400">(optional)</span>
                </label>
                <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl">
                    {imagePreview ? (
                        <div className="flex items-center gap-4">
                            <img
                                src={imagePreview}
                                alt="Profile preview"
                                className="w-16 h-16 rounded-full object-cover border-2 border-blue-500/50"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setImagePreview(null);
                                    setImageFile(null);
                                    if (fileInputRef.current) fileInputRef.current.value = '';
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all group"
                            >
                                <X className="w-4 h-4" />
                                <span>Remover Foto</span>
                            </button>
                        </div>
                    ) : (
                        <div className="w-full" >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all border border-dashed border-blue-500/50 hover:border-blue-500 group"
                            >
                                <ImagePlus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span>Escolher Foto de Perfil</span>
                            </button>
                            <p className="text-center text-gray-400 text-sm mt-2">
                                Tamanho máximo: 5MB
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                data-aos="fade-up" data-aos-duration="1000"
                className="relative w-full h-12 bg-gradient-to-r from-[#3b82f6] to-[#06b6d4] rounded-xl font-medium text-white overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-12 group-hover:translate-y-0 transition-transform duration-300" />
                <div className="relative flex items-center justify-center gap-2">
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Publicando...</span>
                        </>
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            <span>Publicar Comentário</span>
                        </>
                    )}
                </div>
            </button>
        </form>
    );
});

const Komentar = () => {
    const [comments, setComments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        // Initialize AOS
        AOS.init({
            once: false,
            duration: 1000,
        });
    }, []);

    useEffect(() => {
        const commentsRef = collection(db, 'portfolio-comments');
        const q = query(commentsRef, orderBy('createdAt', 'desc'));
        
        return onSnapshot(q, (querySnapshot) => {
            const commentsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setComments(commentsData);
        });
    }, []);

    const uploadImage = useCallback(async (imageFile) => {
        if (!imageFile) return null;
        const storageRef = ref(storage, `profile-images/${Date.now()}_${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        return getDownloadURL(storageRef);
    }, []);

    const handleCommentSubmit = useCallback(async ({ newComment, userName, imageFile }) => {
        setError('');
        setIsSubmitting(true);
        
        try {
            const profileImageUrl = await uploadImage(imageFile);
            await addDoc(collection(db, 'portfolio-comments'), {
                content: newComment,
                userName,
                profileImage: profileImageUrl,
                createdAt: serverTimestamp(),
            });
        } catch (error) {
            setError('Falha ao publicar comentário. Tente novamente.');
            console.error('Error adding comment: ', error);
        } finally {
            setIsSubmitting(false);
        }
    }, [uploadImage]);

    const formatDate = useCallback((timestamp) => {
        if (!timestamp) return '';
        const date = timestamp.toDate();
        const now = new Date();
        const diffMinutes = Math.floor((now - date) / (1000 * 60));
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMinutes < 1) return 'Agora mesmo';
        if (diffMinutes < 60) return `há ${diffMinutes}m`;
        if (diffHours < 24) return `há ${diffHours}h`;
        if (diffDays < 7) return `há ${diffDays}d`;

        return new Intl.DateTimeFormat('pt-PT', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
        }).format(date);
    }, []);

    return (
        <div className="w-full bg-gradient-to-b from-white/10 to-white/5 rounded-2xl overflow-hidden backdrop-blur-xl shadow-xl" data-aos="fade-up" data-aos-duration="1000">
        <div className="p-6 border-b border-white/10" data-aos="fade-down" data-aos-duration="800">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-blue-500/20">
                    <MessageCircle className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                    Comentários <span className="text-blue-400">({comments.length})</span>
                </h3>
            </div>
        </div>
        <div className="p-6 space-y-6">
            {error && (
                <div className="flex items-center gap-2 p-4 text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl" data-aos="fade-in">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm">{error}</p>
                </div>
            )}
            
            <div >
                <CommentForm onSubmit={handleCommentSubmit} isSubmitting={isSubmitting} error={error} />
            </div>

            <div className="space-y-4 h-[300px] overflow-y-auto custom-scrollbar" data-aos="fade-up" data-aos-delay="200">
                {comments.length === 0 ? (
                    <div className="text-center py-8" data-aos="fade-in">
                        <UserCircle2 className="w-12 h-12 text-blue-400 mx-auto mb-3 opacity-50" />
                        <p className="text-gray-400">Nenhum comentário ainda. Comece a conversa!</p>
                    </div>
                ) : (
                    comments.map((comment, index) => (
                        <Comment 
                            key={comment.id} 
                            comment={comment} 
                            formatDate={formatDate}
                            index={index}
                        />
                    ))
                )}
            </div>
        </div>
        <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
                width: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(99, 102, 241, 0.5);
                border-radius: 6px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(99, 102, 241, 0.7);
            }
        `}</style>
    </div>
    );
};

export default Komentar;