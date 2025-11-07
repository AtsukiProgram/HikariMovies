// HikariMovies - メインアプリケーション
import { ScreenManager } from './screenManager.js';
import { ProjectManager } from './projectManager.js';
import { EditorCore } from './editorCore.js';
import { TimelineManager } from './timelineManager.js';
import { MaterialsManager } from './materialsManager.js';

class HikariMovies {
  safeBind(id, event, handler) {
    try {
      const el = document.getElementById(id);
      if(!el){ console.warn(`[bind-miss] #${id}`); return; }
      el.addEventListener(event, handler);
    } catch(e){
      console.error(`[bind-err] #${id}`, e);
      alert("バインドエラー: #"+id+" "+e.message);
    }
  }

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
    this.safeBind('new-project-btn','click',() => this.startNewProject());
    this.safeBind('import-project-btn','click',() => this.screenManager.showScreen('import-screen'));
    this.safeBind('back-from-import','click',() => this.screenManager.showScreen('start-screen'));
    this.safeBind('add-project-file','click',() => document.getElementById('project-file-input').click());
    
    const fileInput = document.getElementById('project-file-input');
    if(fileInput) fileInput.addEventListener('change', (e) => this.importProjectFile(e.target.files[0]));
    
    this.safeBind('back-to-start','click',() => {
      if (confirm('編集内容が保存されていない可能性があります。スタート画面に戻りますか？')) {
        this.screenManager.showScreen('start-screen');
      }
    });
    this.safeBind('save-btn','click',() => this.showSaveModal());
    this.safeBind('save-cookie-btn','click',() => this.saveToLocalStorage());
    this.safeBind('save-download-btn','click',() => this.downloadProject());
    this.safeBind('close-save-modal','click',() => document.getElementById('save-modal').classList.remove('active'));
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
    if(!container) return;
    container.innerHTML = '';
    projects.forEach(project => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.innerHTML = `<h3>${project.name}</h3><p>${new Date(project.lastModified).toLocaleDateString('ja-JP')}</p>`;
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

  showSaveModal() {
    document.getElementById('save-modal').classList.add('active');
  }

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
  try {
    window.hikariMovies = new HikariMovies();
  } catch (e) {
    console.error(e);
    alert("起動時エラー: " + e.message);
  }
});
