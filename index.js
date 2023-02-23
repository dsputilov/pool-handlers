import inum from "inum";

const Pool = class Pool {
	length = 0;
	#handlers = {};		// {uid1: {fn, data}, uid2: {inc: pool}}

	/**
	 * @method include
	 * @description Include one pool into another pool
	 * @param pool			Another instance of pool class
	 * @return {Object}
	 */
	include(pool) {
		let uid;
		if (!pool || !(pool instanceof Pool)) {
			throw new Error('Only other transaction objects can be included in a transaction');
		}
		uid = inum();
		this.#handlers[uid] = {inc: pool};
	}

	/**
	 * @method push
	 * @description Pushes onto the stack a function that will run when the transaction starts.
	 * @param fn			{Function|Array|Number}	Function or array of functions
	 * @param data			{Object=}				The data to be sent to handlers when the pool will be started
	 * @return {Number|undefined}					You can remove this handler from the pool by this id
	 */
	push(fn, data) {
		if (Array.isArray(fn)) {
			fn.forEach(value => {
				this.push(value, data);
			});
		} else {
			const uid = inum();
			this.#handlers[uid] = {fn: fn, data: data};
			this.length++;
			return uid;
		}
	}

	/**
	 * @method clear
	 * @description Clears the call stack
	 */
	clear() {
		this.#handlers = {};
		this.length = 0;
	}

	/**
	 * @method remove
	 * @description Removes a function from the pool by its uid, which was issued when pushing
	 * @param uid		{Number}
	 */
	remove(uid) {
		if (this.#handlers[uid]) {
			delete this.#handlers[uid];
			this.length--;
		}
	}

	/**
	 * @method run
	 * @description Runs all pool methods
	 * @param data	{Object=}		Data passed to each handler
	 */
	run(data) {
		Object.values(this.#handlers).forEach(cfg => {
			const req = cfg.data !== undefined ? [cfg.data, ...data] : data;
			if (cfg.fn) {
				cfg.fn(req);
			} else {
				cfg.inc.run(req);
			}
		});
	}
};

export default Pool;
