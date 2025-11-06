export class TimelineManager {
    constructor(editorCore) {
        this.editor = editorCore;
        this.currentMode = 'video';
        this.selectedObject = null;
        this.init();
    }
    init() {
        this.setupModeSwitch();
    }
    setupModeSwitch() {
        const videoModeBtn = document.getElementById('video-mode-btn');
        const objectModeBtn = document.getElementById('object-mode-btn');
        if (videoModeBtn) videoModeBtn.addEventListener('click', () => this.switchMode('video'));
        if (objectModeBtn) objectModeBtn.addEventListener('click', () => this.switchMode('object'));
    }
    switchMode(mode) {
        this.currentMode = mode;
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        if (mode === 'video') {
            const btn = document.getElementById('video-mode-btn');
            if (btn) btn.classList.add('active');
        } else {
            const btn = document.getElementById('object-mode-btn');
            if (btn) btn.classList.add('active');
        }
    }
}


