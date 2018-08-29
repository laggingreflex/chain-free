const chain = require('.');
const util = require('util');
const assert = require('assert');

describe('basic', () => {
  it('all', done => chain(ok => done(assert.equal(ok, 'ok'))).ok);
  it('custom', done => chain({ done: () => done() }).done);
});

describe('opts', () => {
  it('base', () => {
    const chained = chain(() => {}, {}, { base: { a: 1 } });
    assert.equal(util.inspect(chained), '{ a: 1 }')
    assert.equal(util.inspect(chained.a), '1')
  });
  it('inherit', () => {
    const chained = chain(() => {}, {}, { base: { a: 1 }, inherit: false });
    assert.equal(util.inspect(chained), '{ a: 1 }')
    assert.equal(util.inspect(chained.a), '{ a: 1 }')
  });
});

describe('full', () => {
  it(`chain.a.b('c').d.e('f').g.custom('h').i('j').k`, () => {
    const all = [];
    const custom = [];
    const handle = handler => (...args) => {
      eval(handler).push(args);
      return (...args) => {
        eval(handler).push(args);
      }
    }
    const chained = chain(handle('all'), { custom: handle('custom') });

    chained.a.b('c').d.e('f').g.custom('h').i('j').k;

    assert.deepEqual(all, [
      ['a'],
      ['b', 'a'],
      ['c'],
      ['d', 'b', 'a'],
      ['e', 'd', 'b', 'a'],
      ['f'],
      ['g', 'e', 'd', 'b', 'a'],
      ['i', 'custom', 'g', 'e', 'd', 'b', 'a'],
      ['j'],
      ['k', 'i', 'custom', 'g', 'e', 'd', 'b', 'a'],
    ]);

    assert.deepEqual(custom, [
      ['g', 'e', 'd', 'b', 'a'],
      ['h'],
    ]);
  });
  it('keyChain', done => {
    const chained = chain({
      'key.chain.a': (...args) => {
        // assert.deepEqual(args, )
        done();
      }
    });
    chained.key.chain.a
  });
});

describe('misc', () => {
  it('class', () => {
    const chained = chain(() => {}, {}, { base: class {} });
    new chained();
  });
})
