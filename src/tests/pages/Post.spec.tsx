import { render, screen } from "@testing-library/react";
import { getSession } from "next-auth/react";
import { createMock } from "ts-jest-mock";

import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { getPrismicClient } from "../../services/prismicio";

const content = [
  {
    type: "paragraph",
    text: "Post excerpt",
    spans: [
      {
        start: 0,
        end: 23,
        type: "strong",
      },
      {
        start: 480,
        end: 538,
        type: "strong",
      },
      {
        start: 549,
        end: 562,
        type: "strong",
      },
      {
        start: 549,
        end: 562,
        type: "hyperlink",
        data: {
          link_type: "Web",
          url: "https://www.ofuxico.com.br/famosos/rodrigo-mussi/",
          target: "_blank",
        },
      },
      {
        start: 643,
        end: 667,
        type: "hyperlink",
        data: {
          link_type: "Web",
          url: "https://www.ofuxico.com.br/reality-show/bbb/ex-bbb-rodrigo-mussi-sofre-acidente-de-carro-em-sao-paulo/",
          target: "_blank",
        },
      },
    ],
  },
];
const post = {
  slug: "my-new-post",
  title: "My New Post",
  content: content,
  updatedAt: "March, 10",
};
jest.mock("../../services/prismicio");
jest.mock("next-auth/react");

describe("Posts page", () => {
  it("renders correctly", () => {
    render(<Post post={post} />);

    expect(screen.getByText("My New Post")).toBeInTheDocument();
    expect(screen.getByText("Post excerpt")).toBeInTheDocument();
  });

  it("redirects user if no subscription is found", async () => {
    const getSessionMocked = createMock(getSession);

    getSessionMocked.mockResolvedValueOnce(null);

    const response = await getServerSideProps({
      params: { slug: "my-new-post" },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: "/",
        }),
      })
    );
  });

  it("load initial data", async () => {
    const getSessionMocked = createMock(getSession);
    const getPrismicClientMocked = createMock(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: "My New Post",
          content: [
            {
              type: "paragraph",
              text: "Post excerpt",
            },
          ],
        },
        last_publication_date: "04-01-2022",
      }),
    } as any);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: "fake-activeSubscription",
    } as any);

    const response = await getServerSideProps({
      params: { slug: "my-new-post" },
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: "my-new-post",
            title: "My New Post",
            content: [
              {
                type: "paragraph",
                text: "Post excerpt",
              },
            ],
            updatedAt: "01 de abril de 2022",
          },
        },
      })
    );
  });
});
