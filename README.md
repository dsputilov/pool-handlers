# pool-handlers


Usage:

    import Pool from "pool-handlers";

    const pool = new Pool();
    pool.push(() => {
        console.log('sub1');
    });
    pool.push(() => {
        console.log('sub2');
    });

    pool.run();     //run all handlers