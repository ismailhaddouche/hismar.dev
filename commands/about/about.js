/**
 * COMANDO ABOUT - Información personal
 */
window.commands_about_about_js = {
    async execute(terminal, animation) {
        const { container, content, sidebar } = terminal.createCommandContainer('about');

        const birthDate = new Date(1988, 4, 14);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        const styles = {
            title: 'font-size: 24px; font-weight: bold; color: #39ff14; margin-bottom: 20px;',
            subtitle: 'font-size: 18px; font-weight: bold; color: #39ff14; border-bottom: 1px solid #00ff41; padding-bottom: 5px; margin: 30px 0 15px 0;',
            text: 'font-size: 14px; line-height: 1.7; color: #c7c7c7;',
            listItem: 'padding: 10px 0; font-size: 14px; display: flex; align-items: center; gap: 12px; border-bottom: 1px solid rgba(0, 255, 65, 0.1); color: #c7c7c7;',
            strong: 'font-weight: bold; color: #39ff14; min-width: 80px;',
            link: 'color: #61dafb; text-decoration: none; transition: all 0.3s ease;',
        };

        const personalInfo = `
            <div style="animation: slideInLeft 0.6s ease-out;">
                <h2 style="${styles.title}">Ismail Haddouche Rhali</h2>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="${styles.listItem}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c7c7c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        <strong style="${styles.strong}">Nombre:</strong> Ismail Haddouche Rhali
                    </li>
                    <li style="${styles.listItem}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c7c7c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                        <strong style="${styles.strong}">Edad:</strong> ${age}
                    </li>
                    <li style="${styles.listItem}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c7c7c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                        <strong style="${styles.strong}">Profesión:</strong> Developer/Devop
                    </li>
                </ul>

                <h3 style="${styles.subtitle}">Descripción</h3>
                <p style="${styles.text}">
                    Desarrollador apasionado de la tecnología y la informática. Friki de los videojuegos de mesa, el anime y la lectura de fantasía. Fan de Zerocalcare. Y mas friki aún del cloud computing, estructura de sistemas y la ciberseguridad.
                </p>

                <h3 style="${styles.subtitle}">Perfiles</h3>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="${styles.listItem}">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="#ffffff"><path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>
                        <strong style="${styles.strong}">GitHub:</strong> <a href="https://github.com/ismailhaddouche" target="_blank" style="${styles.link}">ismailhaddouche</a>
                    </li>
                    <li style="${styles.listItem}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#0077B5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"></path></svg>
                        <strong style="${styles.strong}">LinkedIn:</strong> <a href="https://www.linkedin.com/in/ismail-haddouche-rhali-194305334" target="_blank" style="${styles.link}">ismail-haddouche-rhali</a>
                    </li>
                </ul>
            </div>
        `;

        content.innerHTML = personalInfo;

        if (animation && animation.init) {
            animation.init(sidebar);
        }

        terminal.autoScrollConsole(container);
    }
};