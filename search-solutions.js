const ZAI = require('z-ai-web-dev-sdk').default || require('z-ai-web-dev-sdk');

async function searchSolutions() {
    try {
        const zai = new ZAI();

        console.log('🔍 Searching for Keystone Git Smart Commands JavaScript error solutions...');
        const keystoneSolution = await zai.functions.invoke("web_search", {
            query: "JavaScript Cannot access before initialization reference error fix solution 2024",
            num: 5
        });

        console.log('🔍 Searching for GitHub CLI installation solutions...');
        const githubCLISolution = await zai.functions.invoke("web_search", {
            query: "install GitHub CLI gh command not found linux ubuntu fix 2024",
            num: 5
        });

        console.log('🔍 Searching for Next.js module resolution issues...');
        const moduleSolution = await zai.functions.invoke("web_search", {
            query: "Next.js module not found cannot resolve import path alias fix 2024",
            num: 5
        });

        return {
            keystone: keystoneSolution,
            githubCLI: githubCLISolution,
            module: moduleSolution
        };

    } catch (error) {
        console.error('Search failed:', error.message);
        return null;
    }
}

searchSolutions().then(results => {
    console.log('📋 Search Results:');
    console.log(JSON.stringify(results, null, 2));
}).catch(err => console.error(err));