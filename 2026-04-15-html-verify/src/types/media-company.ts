export type CompanyStatus = 'active' | 'inactive'

export interface MediaCompany {
  id: string
  name: string
  businessNumber: string
  ceoName: string
  contactPhone: string
  address: string
  mediaCount: number
  status: CompanyStatus
  registeredAt: string
}
