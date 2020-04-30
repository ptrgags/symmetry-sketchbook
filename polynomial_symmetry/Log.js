class Log {
    constructor() {
        this._lines = [];
        this._max_lines = 100;
        this._div = undefined;
    }
    
    connect() {
        this._div = document.getElementById('log');
    }
    
    _updateHTML() {
        const lines = this._lines.join('<br/>');
        this._div.innerHTML = lines;
    }
    
    _log(level, message) {
        if (this._div === undefined) {
            console.warn('log not ready yet!');
            console.log(level, message);
        }
        
        const colored = `<span class="level">${message}</span>`;
        this._lines.push(colored);
        if (this._lines.length > this._max_lines) {
            this._lines.shift();
        }
        
        this._updateHTML(); 
    }
    
    log(message) {
        this._log('log', message);
    }
    
    warn(message) {
        this._log('warn', message);
    }
    
    error(message) {
        this._log('error', message);
    }
}
