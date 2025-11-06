export class EditorCore {
    constructor() {
        this.canvas = document.getElementById('preview-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.projectData = this.createEmptyProject();
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 30;
        this.fps = 30;
        this.animationFrameId = null;
        this.selectedObject = null;
        this.initCanvas();
        this.setupPlayback();
    }
    initCanvas() {
        this.canvas.width = 1920;
        this.canvas.height = 1080;
        this.render();
    }
    createEmptyProject() {
        return {
            id: null,
            name: '無題のプロジェクト',
            width: 1920,
            height: 1080,
            fps: 30,
            duration: 30,
            objects: []
        };
    }
    setupPlayback() {
        const playBtn = document.getElementById('play-pause-btn');
        if (playBtn) playBtn.addEventListener('click', () => this.togglePlayback());
    }
    togglePlayback() {
        this.isPlaying = !this.isPlaying;
        const playBtn = document.getElementById('play-pause-btn');
        if (playBtn) playBtn.textContent = this.isPlaying ? '⏸️' : '▶️';
        if (this.isPlaying) this.play(); else this.pause();
    }
    play() {
        const startTime = performance.now();
        const initialTime = this.currentTime;
        const animate = (timestamp) => {
            if (!this.isPlaying) return;
            const elapsed = (timestamp - startTime) / 1000;
            this.currentTime = initialTime + elapsed;
            if (this.currentTime >= this.duration) this.currentTime = 0;
            this.updateTimeDisplay();
            this.render();
            this.animationFrameId = requestAnimationFrame(animate);
        };
        this.animationFrameId = requestAnimationFrame(animate);
    }
    pause() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }
    updateTimeDisplay() {
        const current = this.formatTime(this.currentTime);
        const total = this.formatTime(this.duration);
        const display = document.getElementById('time-display');
        if (display) display.textContent = current + ' / ' + total;
    }
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return mins + ':' + secs.toString().padStart(2, '0');
    }
    render() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        const scaleX = this.canvas.width / this.projectData.width;
        const scaleY = this.canvas.height / this.projectData.height;
        this.ctx.scale(scaleX, scaleY);
        this.projectData.objects.forEach(obj => this.renderObject(obj));
        this.ctx.resetTransform();
    }
    renderObject(obj) {
        const visible = this.isObjectVisible(obj);
        if (!visible) return;
        this.ctx.save();
        if (obj.transform) {
            const t = obj.transform;
            this.ctx.translate(t.x || 0, t.y || 0);
            this.ctx.rotate(((t.rotation || 0) * Math.PI) / 180);
            this.ctx.scale(t.scaleX || 1, t.scaleY || 1);
        }
        this.ctx.globalAlpha = obj.opacity || 1;
        if (obj.type === 'rect') this.renderRect(obj);
        else if (obj.type === 'circle') this.renderCircle(obj);
        else if (obj.type === 'text') this.renderText(obj);
        else if (obj.type === 'image') this.renderImage(obj);
        this.ctx.restore();
    }
    isObjectVisible(obj) {
        if (!obj.timeline) return true;
        return this.currentTime >= obj.timeline.start && this.currentTime <= obj.timeline.end;
    }
    renderRect(obj) {
        this.ctx.fillStyle = obj.fillColor || '#ffffff';
        this.ctx.fillRect(0, 0, obj.width || 100, obj.height || 100);
    }
    renderCircle(obj) {
        this.ctx.fillStyle = obj.fillColor || '#ffffff';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, obj.radius || 50, 0, Math.PI * 2);
        this.ctx.fill();
    }
    renderText(obj) {
        this.ctx.fillStyle = obj.color || '#ffffff';
        this.ctx.font = (obj.fontSize || 48) + 'px ' + (obj.fontFamily || 'Arial');
        this.ctx.fillText(obj.text || '', 0, 0);
    }
    renderImage(obj) {
        if (obj.imageElement) {
            try {
                this.ctx.drawImage(obj.imageElement, 0, 0, obj.width || 100, obj.height || 100);
            } catch (e) {
                console.error('画像エラー:', e);
            }
        }
    }
    addObject(obj) {
        obj.id = obj.id || this.generateId();
        obj.timeline = obj.timeline || { start: this.currentTime, end: this.duration };
        this.projectData.objects.push(obj);
        this.render();
    }
    getProjectData() { return this.projectData; }
    loadProjectData(data) {
        this.projectData = data;
        this.duration = data.duration || 30;
        this.currentTime = 0;
        this.render();
    }
    start() {
        this.updateTimeDisplay();
        this.render();
    }
    generateId() { return 'obj_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9); }
}
