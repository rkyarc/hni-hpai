import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Mulai melakukan seeding... 🌱')

  const categoryHerba = await prisma.category.create({
    data: {
      name: 'Herba',
      slug: 'herba',
      description: 'Produk herbal alami HNI HPAI',
    },
  })

  await prisma.product.create({
    data: {
      categoryId: categoryHerba.id,
      name: 'Madu S Jaga',
      slug: 'madu-s-jaga',
      description: 'Madu murni dengan campuran herbal pilihan untuk menjaga stamina.',
      variants: {
        create: [
          {
            name: '285gr',
            sku: 'MD-SJAGA-285',
            price: 120000,
            stock: 50,
            weight: 285
          }
        ]
      }
    }
  })

  console.log('Seeding berhasil diselesaikan! ✅')
}

main()
  .catch((e) => {
    console.error('Terjadi error saat seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })