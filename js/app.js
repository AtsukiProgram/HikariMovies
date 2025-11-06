// HikariMuvies - メインアプリケーション
import { ScreenManager } from './screenManager.js';
import { ProjectManager } from './projectManager.js';
import { EditorCore } from './editorCore.js';
import { TimelineManager } from './timelineManager.js';
import { MaterialsManager } from './materialsManager.js';

class HikariMuvies {
    constructor() {
        this.screenManager = new ScreenManager();
        this.projectManager = new ProjectManager();
        this.editorCore = null;
        this.timelineManager = null;
        this.materialsManager = null;
        this.init();
    }
    init() {
        this.setupEventListeners();
        this.loadSavedProjects();
    }
    setupEventListeners() {
        document.getElementById('new-project-btn').addEventListener('click', () => this.startNewProject());
        document.getElementById('import-project-btn').addEventListener('click', () => this.screenManager.showScreen('import-screen'));
        document.getElementById('back-from-import').addEventListener('click', () => this.screenManager.showScreen('start-screen'));
        document.getElementById('add-project-file').addEventListener('click', () => document.getElementById('project-file-input').click());
        document.getElementById('project-file-input').addEventListener('change', (e) => this.importProjectFile(e.target.files[0]));
        document.getElementById('back-to-start').addEventListener('click', () => {
            if (confirm('編集内容が保存されていない可能性があります。スタート画面に戻りますか？')) {
                this.screenManager.showScreen('start-screen');
            }
        });
        document.getElementById('save-btn').addEventListener('click', () => this.showSaveModal());
        document.getElementById('save-cookie-btn').addEventListener('click', () => this.saveToLocalStorage());
        document.getElementById('save-download-btn').addEventListener('click', () => this.downloadProject());
        document.getElementById('close-save-modal').addEventListener('click', () => document.getElementById('save-modal').classList.remove('active'));
    }
    startNewProject() {
        this.screenManager.showScreen('editor-screen');
        this.initializeEditor();
    }
    initializeEditor() {
        if (!this.editorCore) {
            this.editorCore = new EditorCore();
            this.timelineManager = new TimelineManager(this.editorCore);
            this.materialsManager = new MaterialsManager(this.editorCore);
        }
        this.editorCore.start();
    }
    loadSavedProjects() {
        const projects = this.projectManager.getSavedProjects();
        const container = document.getElementById('saved-projects-list');
        container.innerHTML = '';
        projects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = <h3> + project.name + </h3><p> + new Date(project.lastModified).toLocaleDateString('ja-JP') + </p>;
            card.addEventListener('click', () => this.loadProject(project.id));
            container.appendChild(card);
        });
    }
    loadProject(projectId) {
        const project = this.projectManager.loadProject(projectId);
        if (project) {
            this.screenManager.showScreen('editor-screen');
            this.initializeEditor();
            this.editorCore.loadProjectData(project.data);
        }
    }
    importProjectFile(file) {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                this.screenManager.showScreen('editor-screen');
                this.initializeEditor();
                this.editorCore.loadProjectData(data);
            } catch (error) {
                alert('ファイルの読み込みに失敗しました: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
    showSaveModal() { document.getElementById('save-modal').classList.add('active'); }
    saveToLocalStorage() {
        const projectData = this.editorCore.getProjectData();
        this.projectManager.saveProject(projectData);
        document.getElementById('save-modal').classList.remove('active');
        alert('プロジェクトを保存しました！');
        this.loadSavedProjects();
    }
    downloadProject() {
        const projectData = this.editorCore.getProjectData();
        const jsonStr = JSON.stringify(projectData, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = (projectData.name || '無題のプロジェクト') + '.hmv';
        a.click();
        URL.revokeObjectURL(url);
        document.getElementById('save-modal').classList.remove('active');
    }
}

window.addEventListener('DOMContentLoaded', () => {
    window.hikariMuvies = new HikariMuvies();
});
