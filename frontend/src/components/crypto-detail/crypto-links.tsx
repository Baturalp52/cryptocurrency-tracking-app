"use client";

import React from "react";
import { CryptocurrencyDetail } from "@/services/cryptocurrency/interface";
import {
  Code,
  FileText,
  Globe,
  MessageSquare,
  Search,
  Megaphone,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import TwitterIcon from "../icons/twitter";
import RedditIcon from "../icons/reddit";
import FacebookIcon from "../icons/facebook";

interface CryptoLinksProps {
  cryptoData: CryptocurrencyDetail;
}

export default function CryptoLinks({ cryptoData }: CryptoLinksProps) {
  // Format date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div>
      {/* Basic Info */}
      <div className="mb-4">
        <h6 className="mb-3">Basic Info</h6>
        <div className="table-responsive">
          <table className="table table-borderless table-sm table-no-bg">
            <tbody>
              {/* CMC Rank */}
              {cryptoData.cmc_rank && (
                <tr>
                  <td className="text-muted text-nowrap">CMC Rank</td>
                  <td className="text-end">#{cryptoData.cmc_rank}</td>
                </tr>
              )}

              {/* Category */}
              {cryptoData.category && (
                <tr>
                  <td className="text-muted">Category</td>
                  <td className="text-end">{cryptoData.category}</td>
                </tr>
              )}

              {/* Date Added */}
              <tr>
                <td className="text-muted">Date Added</td>
                <td className="text-end">
                  {formatDate(cryptoData.date_added)}
                </td>
              </tr>

              {/* Last Updated */}
              <tr>
                <td className="text-muted text-nowrap">Last Updated</td>
                <td className="text-end">
                  {formatDate(cryptoData.last_updated)}
                </td>
              </tr>

              {/* Platform (if available) */}
              {cryptoData.platform && (
                <tr>
                  <td className="text-muted">Platform</td>
                  <td className="text-end">{cryptoData.platform.name}</td>
                </tr>
              )}

              {/* Number of Market Pairs */}
              {cryptoData.num_market_pairs && (
                <tr>
                  <td className="text-muted text-nowrap">Market Pairs</td>
                  <td className="text-end">{cryptoData.num_market_pairs}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Links */}
      <div>
        <h6 className="mb-3">Links</h6>
        <div className="d-grid gap-2">
          {/* Website */}
          {cryptoData.urls.website && cryptoData.urls.website.length > 0 && (
            <Link
              href={cryptoData.urls.website[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-link"
            >
              <Globe className="me-1" size={16} />
              Website
            </Link>
          )}

          {/* Explorer */}
          {cryptoData.urls.explorer && cryptoData.urls.explorer.length > 0 && (
            <Link
              href={cryptoData.urls.explorer[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-link"
            >
              <Search className="me-1" size={16} />
              Explorer
            </Link>
          )}

          {/* Source Code */}
          {cryptoData.urls.source_code &&
            cryptoData.urls.source_code.length > 0 && (
              <Link
                href={cryptoData.urls.source_code[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-link"
              >
                <Code className="me-1" size={16} />
                Source Code
              </Link>
            )}

          {/* Technical Doc */}
          {cryptoData.urls.technical_doc &&
            cryptoData.urls.technical_doc.length > 0 && (
              <Link
                href={cryptoData.urls.technical_doc[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-link"
              >
                <FileText className="me-1" size={16} />
                Whitepaper
              </Link>
            )}

          {/* Twitter */}
          {cryptoData.urls.twitter && cryptoData.urls.twitter.length > 0 && (
            <Link
              href={cryptoData.urls.twitter[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-link"
            >
              <TwitterIcon className="me-1" size={16} />
              Twitter
            </Link>
          )}

          {/* Reddit */}
          {cryptoData.urls.reddit && cryptoData.urls.reddit.length > 0 && (
            <Link
              href={cryptoData.urls.reddit[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-link"
            >
              <RedditIcon className="me-1" size={16} />
              Reddit
            </Link>
          )}

          {/* Message Board */}
          {cryptoData.urls.message_board &&
            cryptoData.urls.message_board.length > 0 && (
              <Link
                href={cryptoData.urls.message_board[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-link"
              >
                <MessageSquare className="me-1" size={16} />
                Message Board
              </Link>
            )}

          {/* Facebook */}
          {cryptoData.urls.facebook && cryptoData.urls.facebook.length > 0 && (
            <Link
              href={cryptoData.urls.facebook[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-link"
            >
              <FacebookIcon className="me-1" size={16} />
              Facebook
            </Link>
          )}

          {/* Announcement */}
          {cryptoData.urls.announcement &&
            cryptoData.urls.announcement.length > 0 && (
              <Link
                href={cryptoData.urls.announcement[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="icon-link"
              >
                <Megaphone className="me-1" size={16} />
                Announcement
              </Link>
            )}

          {/* Chat */}
          {cryptoData.urls.chat && cryptoData.urls.chat.length > 0 && (
            <Link
              href={cryptoData.urls.chat[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="icon-link"
            >
              <MessageCircle className="me-1" size={16} />
              Chat
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
