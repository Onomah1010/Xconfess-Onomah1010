import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateConfessionIdempotencyRecords20261016000001
  implements MigrationInterface
{
  name = 'CreateConfessionIdempotencyRecords20261016000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE confession_idempotency_records (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        idempotency_key varchar(255) NOT NULL,
        payload_hash varchar(64) NOT NULL,
        status varchar(16) NOT NULL DEFAULT 'processing',
        response_status integer NULL,
        response_body jsonb NULL,
        confession_id uuid NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
        CONSTRAINT uq_confession_idempotency_records_key UNIQUE (idempotency_key),
        CONSTRAINT fk_confession_idempotency_records_confession
          FOREIGN KEY (confession_id)
          REFERENCES anonymous_confessions(id)
          ON DELETE SET NULL
      )
    `);
    await queryRunner.query(
      'CREATE INDEX idx_confession_idempotency_records_expires_at ON confession_idempotency_records (expires_at)',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DROP TABLE confession_idempotency_records',
    );
  }
}