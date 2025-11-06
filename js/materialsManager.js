export class MaterialsManager {
    constructor(editorCore) {
        this.editor = editorCore;
        this.materials = [];
        this.currentCategory = 'all';
        this.init();
    }
    init() {
        this.setupCategoryButtons();
        this.setupAddMaterial();
        this.loadDefaultMaterials();
    }
    setupCategoryButtons() {
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentCategory = btn.dataset.category;
            });
        });
    }
    setupAddMaterial() {
        const addBtn = document.getElementById('add-material-btn');
        if (addBtn) addBtn.addEventListener('click', () => document.getElementById('file-drop-input').click());
    }
    loadDefaultMaterials() {
        const defaultMaterials = [
            { id: 'rect', name: '矩形', type: 'shape', icon: '▭' },
            { id: 'circle', name: '円', type: 'shape', icon: '●' },
            { id: 'text', name: 'テキスト', type: 'text', icon: 'T' }
        ];
        this.materials = defaultMaterials;
    }
}


