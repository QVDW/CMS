"use client";

import AdmNavbar from "../../../../components/adm/AdmNavbar";
import AuthWrapper from "../../../../components/adm/AuthWrapper";
import { useState, useEffect, useCallback } from "react";
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
    useDroppable,
} from "@dnd-kit/core";
import {
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MdOutlineWork } from "react-icons/md";
import { HiOutlineRefresh, HiOutlinePencil, HiOutlineTrash } from "react-icons/hi";
import { FaCircle } from "react-icons/fa";
import Link from "next/link";

interface Project {
    _id: string;
    project_id: string;
    client_id: string;
    project_name: string;
    project_description: string;
    status: 'Not Started' | 'In Progress' | 'Confirmation Needed' | 'Completed';
    board_active: boolean;
    created_at: string;
    updated_at: string;
    client?: {
        client_id: string;
        company_name: string;
        contact_name: string;
    };
}

interface Column {
    id: string;
    title: string;
    projects: Project[];
    className: string;
}

const STATUSES = [
    { id: 'Not Started', title: 'Not Started', className: 'not-started' },
    { id: 'In Progress', title: 'In Progress', className: 'in-progress' },
    { id: 'Confirmation Needed', title: 'Confirmation Needed', className: 'confirmation-needed' },
    { id: 'Completed', title: 'Completed', className: 'completed' }
];

interface SortableProjectCardProps {
    project: Project;
    onRemoveFromBoard: (projectId: string, projectName: string) => void;
}

interface DroppableColumnProps {
    column: Column;
    children: React.ReactNode;
}

function DroppableColumn({ column, children }: DroppableColumnProps) {
    const { setNodeRef, isOver } = useDroppable({
        id: column.id,
    });

    return (
        <div
            ref={setNodeRef}
            className={`column-content ${isOver ? 'drag-over' : ''}`}
            style={{ minHeight: '400px' }}
        >
            {children}
        </div>
    );
}

function SortableProjectCard({ project, onRemoveFromBoard }: SortableProjectCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: project._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemoveFromBoard(project._id, project.project_name);
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`project-card ${isDragging ? 'dragging' : ''}`}
        >
            <div 
                {...attributes}
                {...listeners}
                className="project-card-content"
            >
                <div className="project-card-header">
                    <MdOutlineWork className="project-icon" />
                    <span className="project-id">#{project.project_id}</span>
                </div>
                
                <h4 className="project-title">{project.project_name}</h4>
                
                {project.client && (
                    <div className="project-company">
                        <div className="company-badge">
                            {project.client.company_name}
                        </div>
                        <div className="contact-info">
                            Contact: {project.client.contact_name}
                        </div>
                    </div>
                )}
                
                {project.project_description && (
                    <p className="project-description">
                        {project.project_description.length > 100 
                            ? `${project.project_description.substring(0, 100)}...`
                            : project.project_description
                        }
                    </p>
                )}
                
                <div className="project-meta">
                    <span className="project-date">
                        Created: {formatDate(project.created_at)}
                    </span>
                </div>
            </div>
            
            <div className="project-actions">
                <Link 
                    href={`/adm/projects/${project._id}/edit`} 
                    className="action-btn edit-btn"
                    onClick={handleEdit}
                    title="Edit Project"
                >
                    <HiOutlinePencil />
                </Link>
                <button 
                    className="action-btn remove-btn"
                    onClick={handleRemove}
                    title="Remove from Board"
                >
                    <HiOutlineTrash />
                </button>
            </div>
        </div>
    );
}

export default function ProjectBoardPage() {
    const [columns, setColumns] = useState<Column[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isUpdating, setIsUpdating] = useState(false);
    const [activeProject, setActiveProject] = useState<Project | null>(null);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [projectToRemove, setProjectToRemove] = useState<{ id: string; name: string } | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const fetchProjects = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/projects?board=true");
            if (!response.ok) throw new Error("Failed to fetch projects");
            const data: Project[] = await response.json();
            
            // Organize projects by status
            const columnData = STATUSES.map(status => ({
                id: status.id,
                title: status.title,
                className: status.className,
                projects: data.filter(project => project.status === status.id)
            }));
            
            setColumns(columnData);
            setError("");
        } catch (err) {
            setError("Failed to load projects");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    const updateProjectStatus = async (projectId: string, newStatus: string) => {
        try {
            const response = await fetch(`/api/projects/${projectId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: newStatus
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update project status');
            }

            return true;
        } catch (error) {
            console.error('Error updating project status:', error);
            return false;
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const project = columns
            .flatMap(col => col.projects)
            .find(p => p._id === active.id);
        setActiveProject(project || null);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveProject(null);

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        // Find which column the active project is in
        const sourceColumn = columns.find(col => 
            col.projects.some(p => p._id === activeId)
        );
        
        // Check if we're dropping over a column or a project
        let targetColumnId = overId;
        const targetColumn = columns.find(col => col.id === overId);
        
        if (!targetColumn) {
            // We're dropping over a project, find its column
            const projectColumn = columns.find(col => 
                col.projects.some(p => p._id === overId)
            );
            if (projectColumn) {
                targetColumnId = projectColumn.id;
            }
        }

        const destinationColumn = columns.find(col => col.id === targetColumnId);

        if (!sourceColumn || !destinationColumn || sourceColumn.id === destinationColumn.id) {
            return;
        }

        const project = sourceColumn.projects.find(p => p._id === activeId);
        if (!project) return;

        setIsUpdating(true);

        // Optimistically update the UI
        const newColumns = columns.map(column => {
            if (column.id === sourceColumn.id) {
                return {
                    ...column,
                    projects: column.projects.filter(p => p._id !== activeId)
                };
            } else if (column.id === destinationColumn.id) {
                return {
                    ...column,
                    projects: [...column.projects, { ...project, status: destinationColumn.id as Project['status'] }]
                };
            }
            return column;
        });

        setColumns(newColumns);

        // Update the database
        const success = await updateProjectStatus(activeId, targetColumnId);
        
        if (!success) {
            setError("Failed to update project status");
            fetchProjects(); // Refresh to get correct state
        }

        setIsUpdating(false);
    };

    const handleRemoveFromBoard = (projectId: string, projectName: string) => {
        setProjectToRemove({ id: projectId, name: projectName });
        setShowRemoveModal(true);
    };

    const confirmRemoveFromBoard = async () => {
        if (!projectToRemove) return;

        try {
            setIsUpdating(true);
            const response = await fetch(`/api/board?projectId=${projectToRemove.id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to remove project from board');
            }

            // Refresh the board
            await fetchProjects();
            setShowRemoveModal(false);
            setProjectToRemove(null);
        } catch (error) {
            console.error('Error removing project from board:', error);
            setError('Failed to remove project from board');
        } finally {
            setIsUpdating(false);
        }
    };

    const cancelRemoveFromBoard = () => {
        setShowRemoveModal(false);
        setProjectToRemove(null);
    };

    if (isLoading) {
        return (
            <AuthWrapper>
                <div className="flex column">
                    <AdmNavbar />
                    <div id="main-content">
                        <div className="board-loading">
                            <div className="loading-spinner"></div>
                            <p>Loading project board...</p>
                        </div>
                    </div>
                </div>
            </AuthWrapper>
        );
    }

    return (
        <AuthWrapper>
            <div className="flex column">
                <AdmNavbar />
                <div id="main-content">
                    <div className="board-header">
                        <h1 className="adm-title">Project Board</h1>
                        <div className="board-actions">
                            <button 
                                onClick={fetchProjects} 
                                className="adm-button refresh-btn"
                                disabled={isUpdating}
                            >
                                <HiOutlineRefresh className={isUpdating ? 'spinning' : ''} />
                                Refresh
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCorners}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <div className="project-board">
                            {columns.map((column) => (
                                <div key={column.id} className={`board-column ${column.className}`}>
                                    <div className="column-header">
                                        <h3 className="column-title">
                                            <FaCircle className={`status-circle ${column.className}`} />
                                            {column.title}
                                        </h3>
                                        <span className="project-count">{column.projects.length}</span>
                                    </div>
                                    
                                    <SortableContext
                                        items={column.projects.map(p => p._id)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <DroppableColumn column={column}>
                                            {column.projects.map((project) => (
                                                <SortableProjectCard
                                                    key={project._id}
                                                    project={project}
                                                    onRemoveFromBoard={handleRemoveFromBoard}
                                                />
                                            ))}
                                            
                                            {column.projects.length === 0 && (
                                                <div className="empty-column">
                                                    <p>No projects in this status</p>
                                                </div>
                                            )}
                                        </DroppableColumn>
                                    </SortableContext>
                                </div>
                            ))}
                        </div>

                        <DragOverlay>
                            {activeProject ? (
                                <div className="project-card dragging">
                                    <div className="project-card-header">
                                        <MdOutlineWork className="project-icon" />
                                        <span className="project-id">#{activeProject.project_id}</span>
                                    </div>
                                    <h4 className="project-title">{activeProject.project_name}</h4>
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>

                    {/* Remove Confirmation Modal */}
                    {showRemoveModal && projectToRemove && (
                        <div className="modal-overlay">
                            <div className="modal-content">
                                <h3>Remove from Board</h3>
                                <p>
                                    Are you sure you want to remove <strong>"{projectToRemove.name}"</strong> from the board?
                                </p>
                                <p className="modal-note">
                                    This will only remove it from the board view. The project will still exist in your projects list.
                                </p>
                                <div className="modal-actions">
                                    <button 
                                        className="adm-button-secondary"
                                        onClick={cancelRemoveFromBoard}
                                        disabled={isUpdating}
                                    >
                                        Cancel
                                    </button>
                                    <button 
                                        className="adm-button-danger"
                                        onClick={confirmRemoveFromBoard}
                                        disabled={isUpdating}
                                    >
                                        {isUpdating ? 'Removing...' : 'Remove from Board'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthWrapper>
    );
} 