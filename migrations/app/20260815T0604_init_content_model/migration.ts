#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/497736dce76d0d0faf6e4b2bb3859f9367eb1df37322417207591c283f92ec2b/contract';
import startContract from '../../snapshots/497736dce76d0d0faf6e4b2bb3859f9367eb1df37322417207591c283f92ec2b/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/67748060701a6fe04b58ef28493c593e39417b95e18de66991c4c0bb40486101/contract';
import endContract from '../../snapshots/67748060701a6fe04b58ef28493c593e39417b95e18de66991c4c0bb40486101/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn, lit, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'certification',
        columns: [
          col('code', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz@1' },
          }),
          col('defaultLanguage', 'text', {
            notNull: true,
            default: lit('pt-BR'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('examDurationMinutes', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('examQuestionCount', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('officialScoreLabel', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('passingScorePercent', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('slug', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('draft'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz@1' },
          }),
          col('vendorId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'domain',
        columns: [
          col('certificationId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('position', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz@1' },
          }),
          col('weightBasisPoints', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'question',
        columns: [
          col('archivedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz@1' } }),
          col('certificationId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('correctOptionCount', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz@1' },
          }),
          col('difficulty', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('domainId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('language', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('publishedAt', 'timestamptz', { codecRef: { codecId: 'pg/timestamptz@1' } }),
          col('source', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('status', 'text', {
            notNull: true,
            default: lit('draft'),
            codecRef: { codecId: 'pg/text@1' },
          }),
          col('stem', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('subtopicId', 'text', { codecRef: { codecId: 'pg/text@1' } }),
          col('type', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'question_option',
        columns: [
          col('content', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('explanation', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('isCorrect', 'bool', { notNull: true, codecRef: { codecId: 'pg/bool@1' } }),
          col('position', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
          col('questionId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'subtopic',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz@1' },
          }),
          col('domainId', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('position', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.createTable({
        schema: 'public',
        table: 'vendor',
        columns: [
          col('createdAt', 'timestamptz', {
            notNull: true,
            default: fn('now()'),
            codecRef: { codecId: 'pg/timestamptz@1' },
          }),
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('name', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('position', 'int4', {
            notNull: true,
            default: lit(0),
            codecRef: { codecId: 'pg/int4@1' },
          }),
          col('slug', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('updatedAt', 'timestamptz', {
            notNull: true,
            codecRef: { codecId: 'pg/timestamptz@1' },
          }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'certification',
        constraint: 'certification_code_key',
        columns: ['code'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'certification',
        constraint: 'certification_slug_key',
        columns: ['slug'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'domain',
        constraint: 'domain_certificationId_position_key',
        columns: ['certificationId', 'position'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'question_option',
        constraint: 'question_option_questionId_position_key',
        columns: ['questionId', 'position'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'subtopic',
        constraint: 'subtopic_domainId_position_key',
        columns: ['domainId', 'position'],
      }),
      this.addUnique({
        schema: 'public',
        table: 'vendor',
        constraint: 'vendor_slug_key',
        columns: ['slug'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'certification',
        constraint: 'certification_status_check',
        column: 'status',
        values: ['draft', 'published', 'archived'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'certification',
        constraint: 'certification_defaultLanguage_check',
        column: 'defaultLanguage',
        values: ['pt-BR', 'en'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'question',
        constraint: 'question_type_check',
        column: 'type',
        values: ['single', 'multiple'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'question',
        constraint: 'question_difficulty_check',
        column: 'difficulty',
        values: ['easy', 'medium', 'hard'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'question',
        constraint: 'question_language_check',
        column: 'language',
        values: ['pt-BR', 'en'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'question',
        constraint: 'question_source_check',
        column: 'source',
        values: ['ai_generated', 'manual'],
      }),
      this.addCheckConstraint({
        schema: 'public',
        table: 'question',
        constraint: 'question_status_check',
        column: 'status',
        values: ['draft', 'published', 'archived'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'certification',
        index: 'certification_vendorId_idx_95bbe6fd',
        columns: ['vendorId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'certification',
        index: 'certification_vendorId_status_idx_b6d79626',
        columns: ['vendorId', 'status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'domain',
        index: 'domain_certificationId_idx_0bbbd665',
        columns: ['certificationId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'question',
        index: 'question_certificationId_idx_0bbbd665',
        columns: ['certificationId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'question',
        index: 'question_certificationId_status_domainId_idx_a3fb23a4',
        columns: ['certificationId', 'status', 'domainId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'question',
        index: 'question_domainId_idx_20643a34',
        columns: ['domainId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'question',
        index: 'question_domainId_status_idx_73647d92',
        columns: ['domainId', 'status'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'question',
        index: 'question_subtopicId_idx_af7fe619',
        columns: ['subtopicId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'question_option',
        index: 'question_option_questionId_idx_fdb42076',
        columns: ['questionId'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'subtopic',
        index: 'subtopic_domainId_idx_20643a34',
        columns: ['domainId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'certification',
        foreignKey: {
          name: 'certification_vendorId_fkey',
          columns: ['vendorId'],
          references: { schema: 'public', table: 'vendor', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'domain',
        foreignKey: {
          name: 'domain_certificationId_fkey',
          columns: ['certificationId'],
          references: { schema: 'public', table: 'certification', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'question',
        foreignKey: {
          name: 'question_certificationId_fkey',
          columns: ['certificationId'],
          references: { schema: 'public', table: 'certification', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'question',
        foreignKey: {
          name: 'question_domainId_fkey',
          columns: ['domainId'],
          references: { schema: 'public', table: 'domain', columns: ['id'] },
          onDelete: 'restrict',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'question',
        foreignKey: {
          name: 'question_subtopicId_fkey',
          columns: ['subtopicId'],
          references: { schema: 'public', table: 'subtopic', columns: ['id'] },
          onDelete: 'setNull',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'question_option',
        foreignKey: {
          name: 'question_option_questionId_fkey',
          columns: ['questionId'],
          references: { schema: 'public', table: 'question', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'subtopic',
        foreignKey: {
          name: 'subtopic_domainId_fkey',
          columns: ['domainId'],
          references: { schema: 'public', table: 'domain', columns: ['id'] },
          onDelete: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
