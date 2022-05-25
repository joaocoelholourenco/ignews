import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { createMock } from "ts-jest-mock";

import { stripe } from "../../services/stripe";
import Home, { getStaticProps } from "../../pages";

jest.mock("next/router");
jest.mock("next-auth/react");
jest.mock("../../services/stripe");

describe("Home page", () => {
  it("renders correctly", () => {
    const useSessionMocked = createMock(useSession);
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
    });

    render(<Home product={{ priceId: "fake-priceId", amount: "R$10,00" }} />);

    expect(screen.getByText("for R$10,00 month")).toBeInTheDocument();
  });
  it("loads initial data", async () => {
    const retriveStripePriceMocked = createMock(stripe.prices.retrieve);

    retriveStripePriceMocked.mockResolvedValueOnce({
      id: "fake-priceId",
      unit_amount: 1000,
    } as any);

    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: { priceId: "fake-priceId", amount: "$10.00" },
        },
      })
    );
  });
});
