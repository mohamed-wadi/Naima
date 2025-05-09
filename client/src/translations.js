// Translations for the egg incubator app
export const translations = {
  // Month translations for proper date formatting
  months: {
    fr: [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ],
    ar: [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ]
  },
  // Weekday translations
  weekdays: {
    fr: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'],
    ar: ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
  },
  fr: {
    // Navbar
    home: "Accueil",
    history: "Historique",
    
    // Home page
    incubationTracking: "Suivi d'Incubation",
    couveuse: "Couveuse",
    leftDoor: "Porte Gauche",
    rightDoor: "Porte Droite",
    tray: "Plateau",
    back: "←",
    
    // Info box
    howToUse: "Comment utiliser cette application",
    step1: "1. Sélectionnez une porte (gauche ou droite) pour voir les plateaux à l'intérieur.",
    step2: "2. Cliquez sur n'importe quel plateau pour ajouter des œufs ou voir/retirer des œufs existants.",
    step3: "3. Choisissez le type d'œuf: canard (25 jours) ou poulet (18 jours).",
    step4: "4. Utilisez le calendrier pour une date personnalisée si vous avez ajouté les œufs avant aujourd'hui.",
    step5: "5. Pour chaque plateau, vous verrez le nombre de jours passés dans la couveuse.",
    step6: "6. Vous recevrez une notification à l'approche de la date d'éclosion.",
    step7: "7. Consultez la page Historique pour voir tous les plateaux et leur statut.",
    
    // Modal
    addEggs: "Ajouter des œufs",
    editTray: "Éditer le plateau",
    eggType: "Type d'œuf",
    chicken: "Poulet",
    duck: "Canard",
    addDate: "Date d'ajout",
    today: "Aujourd'hui",
    customDate: "Date personnalisée",
    selectDate: "Sélectionner une date",
    save: "Enregistrer",
    cancel: "Annuler",
    remove: "Retirer le plateau",
    
    // History page
    allTrays: "Tous les plateaux",
    active: "Actifs",
    removed: "Retirés",
    door: "Porte",
    position: "Position",
    trayNumber: "N° Plateau",
    type: "Type",
    added: "Ajouté le",
    completionDate: "Date de complétion",
    daysRemaining: "Jours restants",
    daysInIncubator: "Jours en couveuse",
    status: "Statut",
    action: "Action",
    noTrays: "Aucun plateau trouvé",
    loading: "Chargement en cours...",
    view: "Voir",
    exportExcel: "Exporter vers Excel",
    clearHistory: "Effacer l'historique des plateaux retirés",
    todayIs: "Note: Aujourd'hui c'est le",
    chicken: "Poulet",
    duck: "Canard",
    removed_status: "Retiré",
    overdue: "Dépassé de",
    days: "jours",
    inIncubation: "En incubation",
    readyToRemove: "Prêt à être retiré",
    historyTitle: "Historique des plateaux",
    
    // Confirmations
    confirmRemove: "Êtes-vous sûr de vouloir retirer ce plateau?",
    yes: "Oui",
    no: "Non",
  },
  ar: {
    // Navbar
    home: "الرئيسية",
    history: "السجل",
    
    // Home page
    incubationTracking: "متابعة التفريخ",
    couveuse: "الحاضنة",
    leftDoor: "الباب الأيسر", // Keep as left door 
    rightDoor: "الباب الأيمن", // Keep as right door
    tray: "الصينية",
    back: "←",
    
    // Info box
    howToUse: "كيفية استخدام هذا التطبيق",
    step1: "١. اختر بابًا (الأيسر أو الأيمن) لرؤية الصواني بالداخل.",
    step2: "٢. انقر على أي صينية لإضافة البيض أو عرض/إزالة البيض الموجود.",
    step3: "٣. اختر نوع البيض: بط (٢٥ يومًا) أو دجاج (١٨ يومًا).",
    step4: "٤. استخدم التقويم لتاريخ مخصص إذا أضفت البيض قبل اليوم.",
    step5: "٥. لكل صينية، سترى عدد الأيام التي مرت في الحاضنة.",
    step6: "٦. ستتلقى إشعارًا عند اقتراب موعد الفقس.",
    step7: "٧. راجع صفحة السجل لرؤية جميع الصواني وحالتها.",
    
    // Modal
    addEggs: "إضافة بيض",
    editTray: "تعديل الصينية",
    eggType: "نوع البيض",
    chicken: "دجاج",
    duck: "بط",
    addDate: "تاريخ الإضافة",
    today: "اليوم",
    customDate: "تاريخ مخصص",
    selectDate: "اختر تاريخًا",
    save: "حفظ",
    cancel: "إلغاء",
    remove: "إزالة الصينية",
    
    // History page
    allTrays: "جميع الصواني",
    active: "نشطة",
    removed: "تمت إزالتها",
    door: "الباب",
    position: "الموضع",
    trayNumber: "رقم الصينية",
    type: "النوع",
    added: "تمت الإضافة في",
    completionDate: "تاريخ الاكتمال",
    daysRemaining: "الأيام المتبقية",
    daysInIncubator: "الأيام في الحاضنة",
    status: "الحالة",
    action: "الإجراء",
    noTrays: "لم يتم العثور على صواني",
    loading: "جاري التحميل...",
    view: "عرض",
    exportExcel: "تصدير إلى إكسل",
    clearHistory: "مسح سجل الصواني المزالة",
    todayIs: "ملاحظة: اليوم هو",
    chicken: "دجاج",
    duck: "بط",
    removed_status: "تمت إزالته",
    overdue: "تجاوز بمقدار",
    days: "يوم",
    inIncubation: "قيد التفريخ",
    readyToRemove: "جاهز للإزالة",
    historyTitle: "سجل الصواني",
    
    // Confirmations
    confirmRemove: "هل أنت متأكد من أنك تريد إزالة هذه الصينية؟",
    yes: "نعم",
    no: "لا",
  }
};
