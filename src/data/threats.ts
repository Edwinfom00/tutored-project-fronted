export const THREATS = [
    {
        id: 'dos',
        name: 'Denial of Service (DoS)',
        description: "Une attaque DoS vise à rendre un service ou un réseau indisponible en le submergeant de requêtes ou de trafic malveillant.",
        detection_method: "Analyse du volume de trafic et détection de pics anormaux via le modèle IA.",
        mitigation: "Limiter les requêtes, filtrer les IP suspectes, utiliser un pare-feu applicatif, mettre en place des systèmes de rate limiting.",
        example: "Un bot envoie 10 000 requêtes par seconde sur le port 80 pour saturer le serveur."
    },
    {
        id: 'probe',
        name: 'Probe (Scan réseau)',
        description: "Un probe est une tentative d'exploration du réseau pour découvrir des machines, services ou failles potentielles.",
        detection_method: "Détection de séquences de connexions sur des ports ou adresses multiples en peu de temps.",
        mitigation: "Bloquer l’IP source, surveiller les logs, alerter l’administrateur, utiliser des honeypots.",
        example: "Un attaquant teste tous les ports de 20 à 1024 sur une IP pour trouver un service ouvert."
    },
    {
        id: 'r2l',
        name: 'Remote to Local (R2L)',
        description: "Une attaque R2L consiste à accéder à une machine distante sans autorisation, souvent via des failles d’authentification ou d’exploitation.",
        detection_method: "Détection de tentatives de connexion inhabituelles ou d'accès à des ressources protégées.",
        mitigation: "Renforcer l’authentification, surveiller les logs, limiter les accès distants, appliquer les correctifs de sécurité.",
        example: "Un attaquant tente de se connecter à un serveur FTP avec des identifiants devinés."
    },
    {
        id: 'u2r',
        name: 'User to Root (U2R)',
        description: "Une attaque U2R vise à obtenir des privilèges administrateur (root) à partir d’un compte utilisateur légitime.",
        detection_method: "Détection de comportements anormaux d’utilisateurs, tentatives d’escalade de privilèges.",
        mitigation: "Limiter les droits des utilisateurs, surveiller les commandes sensibles, appliquer les correctifs.",
        example: "Un utilisateur exploite une faille pour exécuter une commande root sur le serveur."
    },
    {
        id: 'sql_injection',
        name: 'SQL Injection',
        description: "Injection de code SQL malveillant dans une requête pour accéder ou manipuler la base de données.",
        detection_method: "Détection de patterns suspects dans les requêtes réseau ou les logs applicatifs.",
        mitigation: "Valider et échapper toutes les entrées utilisateur, utiliser des requêtes préparées.",
        example: "Un attaquant envoie ' OR 1=1 -- dans un champ de login pour contourner l’authentification."
    },
    {
        id: 'xss',
        name: 'Cross-Site Scripting (XSS)',
        description: "Injection de scripts malveillants dans des pages web pour voler des données ou détourner des sessions.",
        detection_method: "Analyse des requêtes HTTP et détection de scripts ou de balises suspectes.",
        mitigation: "Échapper les entrées utilisateur, utiliser des Content Security Policy (CSP).",
        example: "Un attaquant injecte <script>alert('XSS')</script> dans un formulaire de commentaire."
    },
    {
        id: 'port_scan',
        name: 'Port Scan',
        description: "Balayage systématique des ports d’une machine pour identifier les services ouverts et vulnérables.",
        detection_method: "Détection de multiples tentatives de connexion sur différents ports en peu de temps.",
        mitigation: "Limiter les tentatives de connexion, bloquer les IP suspectes, utiliser des honeypots.",
        example: "Un script tente de se connecter à tous les ports d’un serveur pour trouver une faille."
    },
    {
        id: 'bruteforce',
        name: 'Brute Force',
        description: "Tentative de deviner un mot de passe ou une clé en essayant de nombreuses combinaisons rapidement.",
        detection_method: "Détection de multiples tentatives de connexion échouées en peu de temps sur le même compte ou service.",
        mitigation: "Limiter le nombre d’essais, activer le CAPTCHA, bloquer l’IP après plusieurs échecs.",
        example: "Plus de 50 tentatives de login en 1 minute sur le même compte utilisateur."
    }
]; 