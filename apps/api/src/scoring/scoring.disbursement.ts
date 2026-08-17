export abstract class ScoringDisbursement {
  abstract disburse(applicationId: string): Promise<void>
}

export class NoopScoringDisbursement extends ScoringDisbursement {
  disburse(applicationId: string): Promise<void> {
    void applicationId
    return Promise.resolve()
  }
}
