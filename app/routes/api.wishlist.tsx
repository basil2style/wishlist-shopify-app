import { TypedResponse, json } from "@remix-run/node";

import db from "../db.server";
import { cors } from "remix-utils/cors";


export async function loader({ request }) {
    const url = new URL(request.url);
    const customerId = url.searchParams.get("customerId");
    const shop = url.searchParams.get("shop");
    const productId = url.searchParams.get("productId");

    if (!customerId || !shop || !productId) {
        return json({
            message: "Missing data. Required: customerId, productId, shop",
            method: "GET"
        })
    }

    const wishlist = await db.wishlist.findMany({
        where: {
            customerId: customerId,
            shop: shop,
            productID: productId
        }
    })

    const response = json({
        ok: true,
        message: "Success",
        data: wishlist
    })

    return cors(request, response)
}


export async function action({ request }) {
    const method = request.method;
    let data = await request.formData();
    data = Object.fromEntries(data);

    const customerId = data.customerId;
    const productId = data.productId;
    const shop = data.shop;
    const _action = data.action;
    let response;


    if (!customerId || !productId || !shop) {
        return json({
            message: "Missing data. REquired data: customerId, productID, shop",
            method: method
        })
    }
    console.log("method123", method);

    switch (_action) {
        case "CREATE":
            // const wishlist = await db.wishlist.create({ data: { customerId, productID: productId, shop } })
            const wishlist = await db.wishlist.upsert({ where: { customerId: customerId }, update: { customerId, productID: productId, shop }, create: { customerId, productID: productId, shop } })
            response = json({ message: 'Product added to wishlist', method: 'CREATE', wishlist: wishlist })
            return cors(request, response)
        case "DELETE":
            await db.wishlist.deleteMany({
                where: {
                    customerId: customerId, shop, productID: productId
                }
            })
            response = json({ message: 'Product deleted wishlist', method: _action, wishlisted: false })
            return cors(request, response)
        default:
            return json({ message: "null" })
    }

    return json({ message: "null" })
}

