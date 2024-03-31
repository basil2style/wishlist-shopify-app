import { json } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useBreakpoints, Page, BlockStack, InlineGrid, Box, Card, Text, TextField, Divider, Button } from "@shopify/polaris";
import { useState } from "react";

import db from "../db.server";

export async function loader() {
    // const settings = {
    //     name: "My app",
    //     description: "My app description"
    // }
    const settings = await db.settings.findFirst();
    return json(settings);
}

export async function action({ request }) {

    let settings = await request.formData();
    settings = Object.entries(settings);
    await db.settings.upsert({
        where: {
            id: 1
        },
        update: {
            id: 1, 
            name: settings.name,
            description: settings.description
        },
        create: {
            id: 1,
            name: settings.name,
            description: settings.description
        } 
    })
    return json({ message: "Settings updated" });
}

export default function SettingsPage() {
    const { smUp } = useBreakpoints();
    const settings = useLoaderData();
    const [formState, setFormState] = useState(settings);


    return (
        <Page>
            <ui-title-bar title="Settings page" />
            <BlockStack gap={{ xs: "800", sm: "400" }}>
                <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
                    <Box
                        as="section"
                    >
                        <BlockStack gap="400">
                            <Text variant="headingMd" as="h3" >
                                InterJambs
                            </Text>
                            <Text as="p" variant="bodyMd">
                                Interjambs are the rounded protruding bits of your puzzlie piece
                            </Text>
                        </BlockStack>
                    </Box>
                    <Card roundedAbove="sm">
                        <Form method="POST">
                            <BlockStack gap="400">
                                <TextField label="App name" name="name" value={formState.name} onChange={(value) => setFormState({ ...formState, name: value })} autoComplete="off" />
                                <TextField label="Description" name="description" value={formState.description} onChange={(value) => setFormState({ ...formState, description: value })} autoComplete="off" />
                                <Button submit={true}>Save</Button>
                            </BlockStack>
                        </Form>
                    </Card>
                </InlineGrid>
            </BlockStack>
        </Page>
    );
}


