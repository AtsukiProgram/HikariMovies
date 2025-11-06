export class ProjectManager {
    constructor() { this.storageKey = 'HikariMovies_projects'; }
    getSavedProjects() {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }
    saveProject(projectData) {
        const projects = this.getSavedProjects();
        const projectId = projectData.id || this.generateId();
        const existingIndex = projects.findIndex(p => p.id === projectId);
        const projectInfo = {
            id: projectId,
            name: projectData.name || '無題のプロジェクト',
            lastModified: Date.now(),
            data: projectData
        };
        if (existingIndex >= 0) {
            projects[existingIndex] = projectInfo;
        } else {
            projects.push(projectInfo);
        }
        localStorage.setItem(this.storageKey, JSON.stringify(projects));
        return projectId;
    }
    loadProject(projectId) {
        const projects = this.getSavedProjects();
        return projects.find(p => p.id === projectId);
    }
    deleteProject(projectId) {
        let projects = this.getSavedProjects();
        projects = projects.filter(p => p.id !== projectId);
        localStorage.setItem(this.storageKey, JSON.stringify(projects));
    }
    generateId() { return 'project_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9); }
}


