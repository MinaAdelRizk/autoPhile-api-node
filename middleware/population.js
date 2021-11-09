
module.exports = async function populateSellerListings(seller, item) {
    try {
        seller.listings.push({ categoryName: item.category.name, itemId: item._id })
        await seller.save()

    } catch (error) {
        return error.message
    }
}
