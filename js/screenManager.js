export class ScreenManager {
    constructor() {
        this.screens = {
            'start-screen': document.getElementById('start-screen'),
            'import-screen': document.getElementById('import-screen'),
            'editor-screen': document.getElementById('editor-screen')
        };
        this.currentScreen = 'start-screen';
    }
    showScreen(screenId) {
        Object.keys(this.screens).forEach(id => this.screens[id].classList.remove('active'));
        if (this.screens[screenId]) {
            this.screens[screenId].classList.add('active');
            this.currentScreen = screenId;
        }
    }
    getCurrentScreen() { return this.currentScreen; }
}
