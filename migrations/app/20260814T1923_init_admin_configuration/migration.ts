#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/497736dce76d0d0faf6e4b2bb3859f9367eb1df37322417207591c283f92ec2b/contract';
import endContract from '../../snapshots/497736dce76d0d0faf6e4b2bb3859f9367eb1df37322417207591c283f92ec2b/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/71afc0e3eb1e983210f58d99b190f633bc2afc532f80b560df97c166c4f24b19/contract';
import startContract from '../../snapshots/71afc0e3eb1e983210f58d99b190f633bc2afc532f80b560df97c166c4f24b19/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, lit } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'session',
        column: col('impersonatedBy', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('banExpires', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('banReason', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('banned', 'bool', { default: lit(false), codecRef: { codecId: 'pg/bool@1' } }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'user',
        column: col('role', 'text', { codecRef: { codecId: 'pg/text@1' } }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
