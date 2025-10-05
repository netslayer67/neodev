import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Search,
    MoreHorizontal,
    Filter,
    UserPlus,
    Edit,
    Trash2,
    Shield,
    User,
    Mail,
    Calendar,
    Eye,
    Users,
    Crown,
    AlertCircle,
    CheckCircle,
    X
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import {
    fetchAllUsers,
    createUser,
    updateUser,
    deleteUser
} from "../../store/slices/adminSlice";
import PageLoader from "@/components/PageLoader";

// Input sanitization utility
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
        .replace(/[<>]/g, '')
        .trim()
        .substring(0, 100);
};

// Role Badge Component
const RoleBadge = ({ role }) => {
    const roleConfig = {
        admin: {
            bg: "bg-error/10",
            text: "text-error",
            icon: Crown,
            label: "Admin"
        },
        user: {
            bg: "bg-info/10",
            text: "text-info",
            icon: User,
            label: "User"
        }
    };

    const config = roleConfig[role] || roleConfig.user;
    const IconComponent = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium
      ${config.bg} ${config.text} border border-current/20`}>
            <IconComponent className="w-3 h-3" />
            {config.label}
        </span>
    );
};

// User Form Modal Component
const UserFormModal = ({ isOpen, onClose, user, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'user'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                role: user.role || 'user'
            });
        } else {
            setFormData({
                name: '',
                email: '',
                role: 'user'
            });
        }
    }, [user, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: sanitizeInput(value)
        }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="glass-card border-border max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {user ? <Edit className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                        {user ? 'Edit User' : 'Add New User'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Enter user name"
                            required
                            maxLength={100}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            placeholder="Enter email address"
                            required
                            maxLength={100}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="user">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4" />
                                        User
                                    </div>
                                </SelectItem>
                                <SelectItem value="admin">
                                    <div className="flex items-center gap-2">
                                        <Crown className="w-4 h-4" />
                                        Admin
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : (user ? 'Update' : 'Create')}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

// Main Component
const AdminUsersPage = () => {
    const dispatch = useDispatch();
    const { toast } = useToast();
    const { users = [], status } = useSelector((state) => state.admin) || {};

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("All");

    useEffect(() => {
        dispatch(fetchAllUsers());
    }, [dispatch]);

    // Sanitize search input
    const handleSearchChange = useCallback((e) => {
        const sanitized = sanitizeInput(e.target.value);
        setSearchTerm(sanitized);
    }, []);

    // Filtered users
    const filteredUsers = useMemo(() => {
        return users
            .filter((user) => roleFilter === "All" || user.role === roleFilter)
            .filter((user) => {
                const sanitizedSearch = sanitizeInput(searchTerm);
                return (
                    user.name.toLowerCase().includes(sanitizedSearch.toLowerCase()) ||
                    user.email.toLowerCase().includes(sanitizedSearch.toLowerCase())
                );
            });
    }, [searchTerm, roleFilter, users]);

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleAddUser = () => {
        setSelectedUser(null);
        setIsModalOpen(true);
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;

        try {
            await dispatch(deleteUser(userId)).unwrap();
            toast({
                title: "Success",
                description: "User deleted successfully",
                className: "bg-success/10 border-success/20"
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Failed",
                description: error.message || "Failed to delete user",
                className: "bg-error/10 border-error/20"
            });
        }
    };

    const handleUserSubmit = async (userData) => {
        try {
            if (selectedUser) {
                await dispatch(updateUser({ userId: selectedUser._id, userData })).unwrap();
                toast({
                    title: "Success",
                    description: "User updated successfully",
                    className: "bg-success/10 border-success/20"
                });
            } else {
                await dispatch(createUser(userData)).unwrap();
                toast({
                    title: "Success",
                    description: "User created successfully",
                    className: "bg-success/10 border-success/20"
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Failed",
                description: error.message || `Failed to ${selectedUser ? 'update' : 'create'} user`,
                className: "bg-error/10 border-error/20"
            });
            throw error;
        }
    };

    const roleOptions = [
        { key: "All", label: "All Users", count: users.length },
        { key: "admin", label: "Admins", count: users.filter(u => u.role === 'admin').length },
        { key: "user", label: "Users", count: users.filter(u => u.role === 'user').length },
    ];

    return (
        <div className="relative min-h-screen bg-background">
            {/* Animated Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute -top-20 -left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        x: [0, -80, 0],
                        y: [0, 60, 0],
                        scale: [1, 0.9, 1]
                    }}
                    transition={{ duration: 25, repeat: Infinity }}
                    className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/8 rounded-full blur-3xl"
                />
            </div>

            <div className="relative z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
                    {/* Header Section */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="mb-8"
                    >
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-heading text-foreground mb-2
                  bg-gradient-to-r from-foreground via-accent to-secondary bg-clip-text">
                                    User Management
                                </h1>
                                <p className="text-text-subtle text-lg">
                                    Manage user accounts and permissions
                                </p>
                            </div>

                            <Button
                                onClick={handleAddUser}
                                className="bg-accent hover:bg-accent/90 text-accent-foreground"
                            >
                                <UserPlus className="w-4 h-4 mr-2" />
                                Add User
                            </Button>
                        </div>
                    </motion.div>

                    {/* Stats Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
                    >
                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Users</p>
                                    <p className="text-2xl font-bold text-foreground">{users.length}</p>
                                </div>
                                <Users className="w-8 h-8 text-accent" />
                            </div>
                        </div>
                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Admins</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {users.filter(u => u.role === 'admin').length}
                                    </p>
                                </div>
                                <Crown className="w-8 h-8 text-error" />
                            </div>
                        </div>
                        <div className="glass-card p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">Regular Users</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {users.filter(u => u.role === 'user').length}
                                    </p>
                                </div>
                                <User className="w-8 h-8 text-info" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Controls Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="glass-card p-6 mb-8"
                    >
                        {/* Search Bar */}
                        <div className="relative mb-6">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or email"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="pl-12 h-12 bg-card/50 border-border text-foreground
                  placeholder-muted-foreground rounded-xl backdrop-blur-sm
                  focus:ring-2 focus:ring-accent/50 focus:border-accent
                  transition-all duration-320"
                                maxLength={100}
                            />
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex flex-wrap gap-3">
                            {roleOptions.map((role) => (
                                <motion.button
                                    key={role.key}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setRoleFilter(role.key)}
                                    className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-320
                    ${roleFilter === role.key
                                            ? 'bg-secondary text-secondary-foreground shadow-lg shadow-secondary/25'
                                            : 'bg-muted/10 text-muted-foreground hover:bg-accent/10 hover:text-accent'
                                        } border border-border hover:border-accent/50`}
                                >
                                    {role.label}
                                    <span className="ml-2 px-2 py-0.5 bg-current/20 rounded-full text-xs">
                                        {role.count}
                                    </span>
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>

                    {/* Users Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="glass-card overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-border hover:bg-transparent">
                                        <TableHead className="text-muted-foreground font-medium h-14">
                                            User
                                        </TableHead>
                                        <TableHead className="text-muted-foreground font-medium">
                                            Email
                                        </TableHead>
                                        <TableHead className="text-muted-foreground font-medium">
                                            Role
                                        </TableHead>
                                        <TableHead className="text-muted-foreground font-medium">
                                            Joined
                                        </TableHead>
                                        <TableHead className="text-muted-foreground font-medium text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {status === "loading" && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="py-16 text-center">
                                                <PageLoader />
                                            </TableCell>
                                        </TableRow>
                                    )}

                                    {status === "succeeded" && filteredUsers.map((user, index) => (
                                        <motion.tr
                                            key={user._id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.4, delay: index * 0.05 }}
                                            className="border-border hover:bg-accent/5 transition-all duration-320 cursor-pointer"
                                        >
                                            <TableCell className="font-medium text-foreground">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                                                        <User className="w-4 h-4 text-accent" />
                                                    </div>
                                                    {user.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {user.email}
                                            </TableCell>
                                            <TableCell>
                                                <RoleBadge role={user.role} />
                                            </TableCell>
                                            <TableCell className="text-text-subtle">
                                                {new Date(user.createdAt).toLocaleDateString('id-ID')}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground
                                hover:bg-accent/10 transition-all duration-320"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        align="end"
                                                        className="glass-card border-border min-w-40"
                                                    >
                                                        <DropdownMenuItem
                                                            onClick={() => handleEditUser(user)}
                                                            className="text-foreground hover:bg-accent/10 hover:text-accent
                                transition-colors duration-320"
                                                        >
                                                            <Edit className="w-4 h-4 mr-2" />
                                                            Edit User
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteUser(user._id)}
                                                            className="text-error hover:bg-error/10 hover:text-error
                                transition-colors duration-320"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" />
                                                            Delete User
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </TableBody>
                            </Table>

                            {status === "succeeded" && filteredUsers.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-16 text-muted-foreground"
                                >
                                    <Users className="w-16 h-16 mx-auto mb-4 text-muted/50" />
                                    <p className="text-lg mb-2">No users found</p>
                                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </div>
            </div>

            <UserFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                user={selectedUser}
                onSubmit={handleUserSubmit}
            />
        </div>
    );
};

export default AdminUsersPage;