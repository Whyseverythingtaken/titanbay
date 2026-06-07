import { prisma } from '../src/db'

async function main() {
  await prisma.investment.deleteMany()
  await prisma.investor.deleteMany()
  await prisma.fund.deleteMany()

  const fund1 = await prisma.fund.create({
    data: {
      name: 'Titanbay Growth Fund I',
      vintage_year: 2022,
      target_size_usd: 250_000_000,
      status: 'Fundraising'
    }
  })

  const fund2 = await prisma.fund.create({
    data: {
      name: 'Titanbay Buyout Fund II',
      vintage_year: 2020,
      target_size_usd: 1_000_000_000,
      status: 'Investing'
    }
  })

  await prisma.fund.create({
    data: {
      name: 'Titanbay Venture Fund I',
      vintage_year: 2018,
      target_size_usd: 150_000_000,
      status: 'Closed'
    }
  })

  const investor1 = await prisma.investor.create({
    data: {
      name: 'Goldman Sachs Asset Management',
      investor_type: 'Institution',
      email: 'investments@gsam.com'
    }
  })

  const investor2 = await prisma.investor.create({
    data: {
      name: 'John Smith',
      investor_type: 'Individual',
      email: 'john.smith@example.com'
    }
  })

  const investor3 = await prisma.investor.create({
    data: {
      name: 'Chen Family Trust',
      investor_type: 'FamilyOffice',
      email: 'trust@chenfamily.com'
    }
  })

  await prisma.investment.createMany({
    data: [
      {
        fund_id: fund1.id,
        investor_id: investor1.id,
        amount_usd: 50_000_000,
        investment_date: new Date('2023-03-15')
      },
      {
        fund_id: fund1.id,
        investor_id: investor2.id,
        amount_usd: 500_000,
        investment_date: new Date('2023-04-01')
      },
      {
        fund_id: fund2.id,
        investor_id: investor3.id,
        amount_usd: 75_000_000,
        investment_date: new Date('2021-06-30')
      }
    ]
  })

  console.log('Seed complete.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
