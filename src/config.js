module.exports = {
    getPort: () => {
        return process.env.PORT ?? 3001;
    },
    getCurrVer: () => {
        return process.env.VERSION ?? 'v0.1';
    }
}