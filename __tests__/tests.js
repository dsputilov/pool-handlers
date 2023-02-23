import Pool from "../index.js";

test('Create pool, add 3 handlers, run', () => {
	let pool = new Pool();
	let result = '';
	pool.push(() => {
		result +=1;
	});
	pool.push(() => {
		result +=2;
	});
	pool.push(() => {
		result +=3;
	});

	pool.run();
	expect(result).toBe("123");
});


test('Create 2 pools with handlers, include second into first, run first', () => {
	let pool = new Pool();
	let result = '';
	pool.push(() => {
		result +=1;
	});
	pool.push(() => {
		result +=2;
	});

	let pool2 = new Pool();
	pool2.push(() => {
		result +=3;
	});

	pool.include(pool2);
	pool.run();

	expect(result).toBe("123");
});


test('Create pool with 2 handlers, remove second handler by uid, run', () => {
	let pool = new Pool();
	let result = '';
	pool.push(() => {
		result +=1;
	});
	let uid = pool.push(() => {
		result +=2;
	});

	pool.remove(uid);
	pool.run();

	expect(result).toBe("1");
});